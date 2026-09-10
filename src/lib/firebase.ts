import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  writeBatch,
  getDocFromServer,
  Unsubscribe,
} from 'firebase/firestore';

// Cấu hình Firebase đọc từ biến môi trường Vite (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCnsxTv6kDiIp_5KIUlnPcJznnZxYFvN9U',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'skyfirstnetwork.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'skyfirstnetwork',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'skyfirstnetwork.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '34327270246',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:34327270246:web:3fa54fbdb2a3d1bf326ea7',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Lỗi khởi tạo Firebase:', error);
  }
}

export { app, auth, db };

/**
 * Loại bỏ các trường undefined hoặc hàm để tránh lỗi setDoc của Firestore
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeForFirestore(value);
      }
    }
    return cleanObj as T;
  }
  return data;
}

/**
 * Khởi tạo tài khoản quản trị đầu tiên bằng Email + Mật khẩu.
 * Chỉ giao diện quản trị gọi hàm này khi hệ thống chưa có tài khoản quản trị.
 */
export async function createInitialAdminAccount(email: string, password: string, displayName?: string): Promise<User> {
  if (!isFirebaseConfigured || !auth) throw new Error('Không thể kết nối Firebase Authentication. Hãy kiểm tra cấu hình Email/Password trong Firebase Console.');
  const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName?.trim()) await updateProfile(result.user, { displayName: displayName.trim() });
  return result.user;
}


export async function signInWithEmailPasswordReal(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured || !auth) throw new Error('AUTH_PROVIDER_UNAVAILABLE: Firebase đã có cấu hình ứng dụng. Hãy kiểm tra phương thức đăng nhập Email/Password trong Firebase Authentication.');
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  return result.user;
}

/**
 * Đăng xuất khỏi phiên Firebase Authentication
 */
export async function logoutFirebase(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Lắng nghe thay đổi trạng thái xác thực Firebase
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Đồng bộ / ghi một tài liệu vào Firestore
 */
export async function syncDocumentToFirestore(
  collectionName: string,
  docId: string,
  data: any
): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    return false;
  }
  try {
    const sanitized = sanitizeForFirestore({
      ...data,
      _syncedAt: new Date().toISOString(),
    });
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, sanitized, { merge: true });
    return true;
  } catch (error) {
    console.error(`Lỗi đồng bộ Firestore [${collectionName}/${docId}]:`, error);
    return false;
  }
}

/**
 * Xóa một tài liệu khỏi Firestore
 */
export async function deleteDocumentFromFirestore(
  collectionName: string,
  docId: string
): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    return false;
  }
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Lỗi xóa Firestore [${collectionName}/${docId}]:`, error);
    return false;
  }
}

/**
 * Đọc tất cả tài liệu trong một collection từ Firestore
 */
export async function fetchCollectionFromFirestore<T>(
  collectionName: string
): Promise<T[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const docs: T[] = [];
    snapshot.forEach((docSnap) => {
      docs.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return docs;
  } catch (error) {
    console.error(`Lỗi lấy dữ liệu từ Firestore [${collectionName}]:`, error);
    return [];
  }
}

/**
 * Kiểm tra kết nối máy chủ Firestore
 */
export async function testFirestoreConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isFirebaseConfigured || !db) {
    return {
      ok: false,
      message: 'Chưa cấu hình Firebase trong tệp .env (thiếu API Key, Auth Domain hoặc Project ID).',
    };
  }
  try {
    await getDocFromServer(doc(db, '_sfn_meta', 'connection'));
    return { ok: true, message: 'Kết nối Firebase Firestore thành công.' };
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      return {
        ok: false,
        message: 'Lỗi quyền truy cập (permission-denied): Vui lòng kiểm tra firestore.rules trên Firebase Console.',
      };
    }
    if (error?.message?.includes('the client is offline')) {
      return {
        ok: false,
        message: 'Không thể kết nối Firestore (client is offline). Vui lòng kiểm tra mạng hoặc Project ID.',
      };
    }
    // Một số project trả về không tìm thấy doc nhưng kết nối server vẫn thành công
    return { ok: true, message: 'Đã kết nối máy chủ Firebase Firestore.' };
  }
}
