import React, { useState, useEffect, useMemo } from 'react';
import { useDataContext } from '../../context/DataContext';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Clock,
  Tag,
  Save,
  Link as LinkIcon,
  Sparkles,
  Image as ImageIcon,
  Search,
  History,
  Globe,
  LayoutTemplate,
  ShieldCheck,
  Monitor,
  Smartphone,
  Copy,
  X,
} from 'lucide-react';
import { NewsArticle, PageRoute, AdminManagerActionRef, PageBlock } from '../../types';
import { ImageUrlInput, EntityBadge, EntityColorPicker, RichTextRenderer } from '../../components/UIPrimitives';
import { createUniqueSlug, generateSlug, getArticleSlug } from '../../utils/contentUtils';
import { RichTextEditor } from './RichTextEditor';
import { adminApi } from '../../lib/firebase';

interface AdminNewsManagerProps {
  articles: NewsArticle[];
  onUpdateArticle: (id: string, updates: Partial<NewsArticle>) => Promise<boolean> | boolean | void;
  onAddArticle: (article: NewsArticle) => Promise<boolean>;
  onDeleteArticle: (id: string) => Promise<boolean>;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
  initialSlug?: string;
  actionRef?: React.MutableRefObject<AdminManagerActionRef | null>;
  onViewModeChange?: (mode: 'list' | 'edit') => void;
}

// 12 Mẫu bài viết chuẩn báo chí & tổ chức theo mục đích (Phụ lục Nghiên cứu Chuyên sâu Mục III.2)
interface ArticleEditorialTemplate {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  summaryTemplate: string;
  htmlTemplate: string;
  suggestedTags: string[];
  defaultBlocks?: PageBlock[];
}

export const EDITORIAL_ARTICLE_TEMPLATES: ArticleEditorialTemplate[] = [
  {
    id: 'activity_news',
    name: '1. Tin tức hoạt động',
    category: 'community',
    categoryLabel: 'Tình nguyện & Cộng đồng',
    description: 'Cập nhật hoạt động, lớp học, buổi sinh hoạt hoặc chiến dịch vừa triển khai của Mạng lưới.',
    summaryTemplate:
      'Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First vừa triển khai hoạt động [Tên hoạt động] với sự tham gia của đội ngũ tình nguyện viên và người học.',
    htmlTemplate:
      '<h2>Bối cảnh và mục tiêu hoạt động</h2><p>Giới thiệu thời gian, địa điểm/hình thức tổ chức và mục tiêu cụ thể của hoạt động trong khuôn khổ Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First.</p><h2>Nội dung triển khai trọng tâm</h2><p>Trình bày các phần việc chính đã thực hiện, phương pháp phối hợp giữa các ban/đơn vị trực thuộc và sự tham gia của người trẻ.</p><h2>Kết quả ghi nhận và bước tiếp theo</h2><p>Tổng hợp kết quả thực tế đạt được sau hoạt động và kế hoạch duy trì trong giai đoạn tới.</p>',
    suggestedTags: ['Hoạt động Sky First', 'Cộng đồng', 'Người trẻ'],
  },
  {
    id: 'official_announcement',
    name: '2. Thông báo chính thức',
    category: 'announcement',
    categoryLabel: 'Thông báo',
    description: 'Thông báo vận hành, quyết định nhân sự, lịch làm việc hoặc cập nhật quy định chính thức.',
    summaryTemplate:
      'Thông báo chính thức trên Trang Thông Tin Điện Tử Sky First về việc [Nội dung thông báo], áp dụng từ ngày [dd/mm/yyyy].',
    htmlTemplate:
      '<h2>Nội dung thông báo</h2><p>Căn cứ định hướng vận hành của Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First (Sky First Network), Ban Điều hành thông báo nội dung cụ thể như sau:</p><h2>Phạm vi và thời gian áp dụng</h2><ul><li><strong>Đối tượng áp dụng:</strong> Các ban chuyên môn, đơn vị trực thuộc và thành viên liên quan.</li><li><strong>Thời gian hiệu lực:</strong> Từ ngày công bố đến khi có thông báo cập nhật.</li></ul><h2>Đầu mối tiếp nhận và hỗ trợ</h2><p>Mọi thắc mắc vui lòng liên hệ Văn phòng Sky First Network qua email chính thức <strong>lienhe@skyfirst.io.vn</strong>.</p>',
    suggestedTags: ['Thông báo chính thức', 'Vận hành', 'Sky First Network'],
  },
  {
    id: 'recruitment',
    name: '3. Bài tuyển thành viên / tình nguyện viên',
    category: 'hr',
    categoryLabel: 'Tuyển dụng & Nhân sự',
    description: 'Thông báo mở đợt tuyển Core Team, Thành viên hoặc Tình nguyện viên theo chương trình.',
    summaryTemplate:
      'Sky First Network chính thức mở đơn tuyển [Vị trí / Đợt tuyển] dành cho người trẻ mong muốn rèn luyện kỹ năng, làm việc có quy trình và đóng góp cho cộng đồng.',
    htmlTemplate:
      '<h2>Giới thiệu đợt tuyển và vai trò</h2><p>Nêu rõ mục đích đợt tuyển, đơn vị tiếp nhận (Văn phòng, các Ban hoặc CLB Tiếng Anh The Sky First - SFEC) và giá trị thực tế đối với người tham gia.</p><h2>Các vị trí đang mở và yêu cầu</h2><ul><li><strong>Vị trí 1:</strong> Mô tả công việc cụ thể, yêu cầu kỹ năng và thời lượng cam kết.</li><li><strong>Vị trí 2:</strong> Mô tả công việc cụ thể, yêu cầu kỹ năng và thời lượng cam kết.</li></ul><h2>Quyền lợi phát triển và ghi nhận</h2><p>Cơ hội đào tạo nội bộ, thực hành điều phối thực tế và cấp Giấy chứng nhận khi hoàn thành nhiệm vụ theo quy định.</p><h2>Quy trình và thời hạn đăng ký</h2><p>Ứng viên gửi hồ sơ trực tuyến tại chuyên mục Tham gia trên Trang Thông Tin Điện Tử Sky First trước 23:59 ngày [dd/mm/yyyy].</p>',
    suggestedTags: ['Tuyển thành viên', 'Tình nguyện viên', 'Core Team'],
  },
  {
    id: 'program_intro',
    name: '4. Bài giới thiệu chương trình / dự án',
    category: 'project',
    categoryLabel: 'Chương trình & Dự án',
    description: 'Giới thiệu tổng quan mục tiêu, đối tượng và lộ trình của một chương trình hoặc dự án mới.',
    summaryTemplate:
      'Chương trình [Tên chương trình] do Sky First Network khởi xướng hướng đến việc tạo không gian học tập và rèn luyện thực tế cho [Đối tượng mục tiêu].',
    htmlTemplate:
      '<h2>Ý tưởng và mục tiêu chương trình</h2><p>Giải thích nhu cầu thực tế từ cộng đồng/người học và mục tiêu mà chương trình hướng tới.</p><h2>Đối tượng tham gia và cấu trúc hoạt động</h2><p>Mô tả lộ trình triển khai theo từng giai đoạn, hình thức tổ chức (trực tuyến / trực tiếp) và đơn vị phụ trách chuyên môn.</p><h2>Cách thức đăng ký hoặc đồng hành</h2><p>Hướng dẫn người học, tình nguyện viên hoặc đối tác đăng ký tham gia tại trang Chương trình & Dự án.</p>',
    suggestedTags: ['Chương trình', 'Dự án giáo dục', 'Sky First'],
  },
  {
    id: 'activity_recap',
    name: '5. Bài tổng kết hoạt động',
    category: 'report',
    categoryLabel: 'Báo cáo & Công khai',
    description: 'Nhìn lại toàn diện kết quả, bài học kinh nghiệm và dấu ấn sau khi kết thúc một chương trình/kỳ hoạt động.',
    summaryTemplate:
      'Tổng kết hành trình triển khai [Tên chương trình/kỳ hoạt động] với những kết quả được ghi nhận minh bạch và định hướng cải tiến cho giai đoạn tiếp theo.',
    htmlTemplate:
      '<h2>Tổng quan quá trình triển khai</h2><p>Tóm lược thời gian diễn ra, đơn vị chủ trì và các hạng mục công việc đã hoàn thành.</p><h2>Những kết quả và số liệu ghi nhận thực tế</h2><p>Trình bày số lượng buổi học/hoạt động, số người tham gia hoàn thành và sản phẩm đầu ra đã được kiểm chứng.</p><h2>Lời cảm ơn và định hướng tiếp theo</h2><p>Ghi nhận sự đóng góp của đội ngũ tình nguyện viên, người học và các đơn vị đồng hành.</p>',
    suggestedTags: ['Tổng kết hoạt động', 'Báo cáo', 'Minh bạch'],
  },
  {
    id: 'interview',
    name: '6. Bài phỏng vấn',
    category: 'youth',
    categoryLabel: 'Phát triển Người trẻ',
    description: 'Trò chuyện cùng thành viên, tình nguyện viên, người học hoặc cố vấn chuyên môn theo định dạng Hỏi - Đáp (Q&A).',
    summaryTemplate:
      'Cuộc trò chuyện cùng [Họ tên – Vai trò] về hành trình học hỏi, trưởng thành và tạo giá trị thực tế trong hệ sinh thái Sky First.',
    htmlTemplate:
      '<h2>Nhân vật và câu chuyện mở đầu</h2><p>Giới thiệu ngắn gọn về nhân vật, vai trò hiện tại và cơ duyên gắn bó cùng Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First.</p><blockquote><p>"Trích dẫn câu nói tâm đắc nhất của nhân vật trong buổi trò chuyện."</p></blockquote><h2>Đối thoại chi tiết</h2><p><strong>Phóng viên / Ban Truyền thông:</strong> Câu hỏi mở đầu về trải nghiệm thực tế khi tham gia hoạt động?</p><p><strong>Nhân vật chia sẻ:</strong> Nội dung câu trả lời chân thực, cụ thể của nhân vật.</p><h2>Thông điệp gửi đến người trẻ</h2><p>Lời nhắn nhủ dành cho các bạn học sinh, sinh viên đang tìm kiếm môi trường rèn luyện và cống hiến.</p>',
    suggestedTags: ['Phỏng vấn', 'Con người Sky First', 'Góc nhìn người trẻ'],
  },
  {
    id: 'expert_analysis',
    name: '7. Bài phân tích / chia sẻ chuyên môn',
    category: 'education',
    categoryLabel: 'Giáo dục & Đào tạo',
    description: 'Bài viết chuyên sâu về phương pháp học tập, ngoại ngữ, kỹ năng làm việc nhóm hoặc quản trị dự án cộng đồng.',
    summaryTemplate:
      'Bài viết phân tích các phương pháp thực tiễn giúp người trẻ nâng cao năng lực [Chủ đề chuyên môn] và ứng dụng hiệu quả vào học tập, công việc.',
    htmlTemplate:
      '<h2>Đặt vấn đề</h2><p>Xác định thách thức phổ biến mà người học hoặc người làm dự án cộng đồng thường gặp phải.</p><h2>Phân tích nguyên nhân và khung phương pháp</h2><p>Trình bày các luận điểm rõ ràng, có ví dụ thực tế từ hoạt động giáo dục và điều phối tại Sky First.</p><h2>Gợi ý áp dụng thực tế</h2><ol><li>Bước 1: Xác định mục tiêu và đầu ra cụ thể.</li><li>Bước 2: Lập kế hoạch thực hành theo tuần.</li><li>Bước 3: Tự đánh giá và cải tiến liên tục.</li></ol>',
    suggestedTags: ['Chia sẻ chuyên môn', 'Giáo dục', 'Kỹ năng'],
  },
  {
    id: 'community_story',
    name: '8. Câu chuyện người trẻ & cộng đồng',
    category: 'community',
    categoryLabel: 'Tình nguyện & Cộng đồng',
    description: 'Kể lại những khoảnh khắc, hành trình thay đổi tích cực từ các lớp học cộng đồng và hoạt động tình nguyện.',
    summaryTemplate:
      'Từ những buổi học trực tuyến miễn phí đến không gian gắn kết cộng đồng, hành trình tại Sky First được viết nên bởi sự kiên trì và tinh thần sẻ chia.',
    htmlTemplate:
      '<h2>Khởi đầu từ những điều giản dị</h2><p>Kể lại bối cảnh bắt đầu của lớp học hoặc sáng kiến cộng đồng một cách chân thực, gần gũi.</p><h2>Sự đồng hành giữa người dạy và người học</h2><p>Những câu chuyện cụ thể về sự nỗ lực vượt khó, tinh thần trách nhiệm của tình nguyện viên và sự tiến bộ của học viên.</p><h2>Giá trị đọng lại</h2><p>Khẳng định triết lý phát triển bền vững: người nhận cơ hội hôm nay trở thành người trao cơ hội cho cộng đồng ngày mai.</p>',
    suggestedTags: ['Câu chuyện cộng đồng', 'Truyền cảm hứng', 'SFEC'],
  },
  {
    id: 'event_report',
    name: '9. Bài tường thuật sự kiện',
    category: 'event',
    categoryLabel: 'Sự kiện',
    description: 'Tường thuật diễn biến hội thảo, buổi tập huấn, lễ ra mắt hoặc sự kiện giao lưu học thuật.',
    summaryTemplate:
      'Sự kiện [Tên sự kiện] diễn ra vào ngày [dd/mm/yyyy] đã mang đến nhiều góc nhìn thực tế cùng hoạt động thảo luận sôi nổi.',
    htmlTemplate:
      '<h2>Không khí mở màn và mục đích sự kiện</h2><p>Thông tin thời gian, hình thức tổ chức, thành phần tham dự và thông điệp mở đầu sự kiện.</p><h2>Các phiên nội dung và thảo luận nổi bật</h2><p>Tóm lược các phần trình bày chính, hoạt động tương tác và những câu hỏi thực tế từ người tham dự.</p><h2>Tổng kết và tài liệu sau sự kiện</h2><p>Thông tin về học liệu được phép chia sẻ công khai và các hoạt động tiếp nối sau sự kiện.</p>',
    suggestedTags: ['Sự kiện', 'Hội thảo', 'Tường thuật'],
  },
  {
    id: 'impact_report',
    name: '10. Bài báo cáo kết quả / tác động',
    category: 'report',
    categoryLabel: 'Báo cáo & Công khai',
    description: 'Công bố báo cáo tác động định kỳ kèm bảng số liệu minh bạch, phương pháp đo lường và nguồn đối chiếu.',
    summaryTemplate:
      'Báo cáo tổng hợp các chỉ số đầu ra và mức độ tác động thực tế của chương trình [Tên chương trình], cập nhật đến [Tháng/Năm].',
    htmlTemplate:
      '<h2>Phạm vi và phương pháp tổng hợp số liệu</h2><p>Giải thích rõ kỳ báo cáo, nguồn dữ liệu đối chiếu và quy tắc thống kê minh bạch của Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First.</p><h2>Bảng tổng hợp kết quả đầu ra</h2><table><thead><tr><th>Hạng mục chỉ số</th><th>Kết quả ghi nhận</th><th>Ghi chú xác minh</th></tr></thead><tbody><tr><td>Số lớp học / hoạt động</td><td>Cập nhật theo hồ sơ</td><td>Đối chiếu hệ thống quản trị</td></tr><tr><td>Số tình nguyện viên tham gia</td><td>Cập nhật theo hồ sơ</td><td>Danh sách xác nhận theo đợt</td></tr></tbody></table><h2>Đánh giá chất lượng và khuyến nghị</h2><p>Nhận định thẳng thắn về những điểm làm tốt và các hạng mục cần hoàn thiện trong kỳ tiếp theo.</p>',
    suggestedTags: ['Báo cáo tác động', 'Công khai minh bạch', 'Dữ liệu'],
  },
  {
    id: 'educational_guide',
    name: '11. Bài hướng dẫn / giáo dục',
    category: 'education',
    categoryLabel: 'Giáo dục & Đào tạo',
    description: 'Cẩm nang hướng dẫn từng bước dành cho học viên, tình nguyện viên hoặc người sử dụng hệ thống.',
    summaryTemplate:
      'Tài liệu hướng dẫn chi tiết từng bước giúp người học và tình nguyện viên nắm vững quy trình [Tên quy trình / kỹ năng] tại Sky First.',
    htmlTemplate:
      '<h2>Mục tiêu và đối tượng áp dụng</h2><p>Xác định rõ ai cần đọc hướng dẫn này và kết quả đạt được sau khi thực hiện đầy đủ các bước.</p><h2>Hướng dẫn thực hiện từng bước</h2><h3>Bước 1: Chuẩn bị thông tin và công cụ</h3><p>Mô tả chi tiết những nội dung cần chuẩn bị trước khi bắt đầu.</p><h3>Bước 2: Thao tác thực hiện chuẩn</h3><p>Hướng dẫn rõ ràng kèm lưu ý bảo mật thông tin cá nhân.</p><h2>Các câu hỏi thường gặp (FAQ)</h2><p>Giải đáp ngắn gọn những vướng mắc thường gặp và kênh liên hệ hỗ trợ kỹ thuật.</p>',
    suggestedTags: ['Hướng dẫn', 'Học liệu', 'Cẩm nang'],
  },
  {
    id: 'longform_emagazine',
    name: '12. Bài dài đặc biệt (Longform / e-Magazine)',
    category: 'media',
    categoryLabel: 'Truyền thông & Lan tỏa',
    description: 'Bài chuyên đề мульти-chương có chiều sâu báo chí, kết hợp trích dẫn lớn, hộp thông tin và thư viện ảnh.',
    summaryTemplate:
      'Chuyên đề đặc biệt khắc họa hành trình kiến tạo hệ sinh thái giáo dục và phát triển cộng đồng bền vững của Sky First Network.',
    htmlTemplate:
      '<h2>Chương I: Khởi nguồn từ khát vọng mở rộng cơ hội học tập</h2><p>Mở đầu chuyên đề với câu chuyện hình thành từ nhu cầu thực tiễn của người học và tinh thần tình nguyện có tổ chức.</p><blockquote><p>"Bầu trời không phải là giới hạn cuối cùng mà là điểm bắt đầu để mỗi người trẻ tiếp tục học hỏi, thử sức và tạo giá trị cho cộng đồng."</p></blockquote><h2>Chương II: Chuẩn hóa hệ thống để phát triển bền vững</h2><p>Phân tích bước chuyển mình từ các hoạt động đơn lẻ sang mô hình Mạng lưới có quy trình, có phân quyền và nền tảng số đồng bộ.</p><h2>Chương III: Hướng tới tương lai cộng đồng bền vững</h2><p>Tầm nhìn dài hạn kết nối người học, tình nguyện viên, đội ngũ chuyên môn và các nguồn lực xã hội.</p>',
    suggestedTags: ['Longform', 'e-Magazine', 'Chuyên đề Sky First'],
  },
];

const stripHtmlText = (html: string): string =>
  String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const AdminNewsManager: React.FC<AdminNewsManagerProps> = ({
  articles,
  onUpdateArticle,
  onAddArticle,
  onDeleteArticle,
  onNavigate,
  onShowToast,
  initialSlug,
  actionRef,
  onViewModeChange,
}) => {
  const { siteConfig } = useDataContext();
  const taxonomyOptions = (siteConfig.taxonomyCategories || []).filter((x: any) => x.visible !== false);
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);
  const [dirty, setDirty] = useState(false);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('activity_news');
  const [previewDevice, setPreviewDevice] = useState<'none' | 'desktop' | 'mobile'>('none');
  const [socialDraft, setSocialDraft] = useState<string>('');

  useEffect(() => {
    if (initialSlug) {
      const target = articles.find((a) => a.slug === initialSlug || a.id === initialSlug);
      if (target) {
        setSelectedArticleId(target.id);
        setViewMode('edit');
      }
    }
  }, [initialSlug, articles]);

  const activeArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];

  useEffect(() => {
    if (viewMode !== 'edit' || !dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [viewMode, dirty]);

  const loadRevisions = async (articleId: string) => {
    try {
      const d = await adminApi(`/api/system?action=revisions&entityType=cms:news_articles&entityId=${encodeURIComponent(articleId)}`);
      setRevisions(d.items || []);
    } catch {
      setRevisions([]);
    }
  };

  const restoreRevision = async (revId: string) => {
    try {
      const d = await adminApi('/api/system?action=restore-revision', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ revisionId: revId }),
      });
      if (d?.item && activeArticle) {
        await onUpdateArticle(activeArticle.id, d.item);
        onShowToast('Đã khôi phục phiên bản bài viết thành công.');
        setShowRevisions(false);
      }
    } catch (e: any) {
      onShowToast(e.message || 'Không thể khôi phục phiên bản.');
    }
  };

  const handleCreateNew = async () => {
    const newId = `news-${Date.now()}`;
    const initialTitle = 'Tiêu Đề Bài Viết Tin Tức Mới';
    const initialSlug = createUniqueSlug(initialTitle, articles.map((x) => x.slug || ''));

    const newArticle: NewsArticle = {
      id: newId,
      slug: initialSlug,
      title: initialTitle,
      category: 'announcement',
      categoryLabel: 'Thông báo',
      date: new Date().toLocaleDateString('vi-VN'),
      summary: 'Đoạn tóm tắt mở đầu (Sapo) giới thiệu ngắn gọn các điểm cốt lõi của bài viết.',
      content: 'Nội dung chi tiết của bài viết được trình bày ở đây với đầy đủ thông tin, luận điểm và hình ảnh minh họa.',
      contentFormatted:
        '<h2>Tiêu đề phần 1</h2><p>Nội dung chi tiết của bài viết được trình bày ở đây với đầy đủ thông tin, luận điểm và hình ảnh minh họa.</p><h2>Tiêu đề phần 2</h2><p>Tiếp tục triển khai các nội dung quan trọng tiếp theo.</p>',
      pageBlocks: [],
      author: 'Ban Truyền thông Sky First Network',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '3 phút đọc',
      imageUrl: '',
      imageFit: 'original',
      imageDescription: 'Ảnh minh họa bài viết tin tức',
      tags: [],
      isPublished: false,
      editorialStatus: 'draft',
      allowComments: true,
      source: 'Trang Thông Tin Điện Tử Sky First',
    };

    const created = await onAddArticle(newArticle);
    if (!created) {
      onShowToast('Chưa thể tạo bài viết trên máy chủ.');
      return;
    }
    setSelectedArticleId(newId);
    setViewMode('edit');
    setDirty(false);
    onShowToast('Đã tạo bài viết mới ở chế độ Bản nháp! Đang mở trình biên tập.');
  };

  useEffect(() => {
    if (actionRef) {
      actionRef.current = { handleCreateNew };
    }
    return () => {
      if (actionRef) actionRef.current = null;
    };
  }, [actionRef, articles]);

  useEffect(() => {
    onViewModeChange?.(viewMode);
  }, [viewMode, onViewModeChange]);

  const handleEditClick = (article: NewsArticle) => {
    setSelectedArticleId(article.id);
    setDirty(false);
    setSocialDraft('');
    setPreviewDevice('none');
    setViewMode('edit');
  };

  const handleTogglePublish = async (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = article.isPublished === false;
    const saved = await onUpdateArticle(article.id, {
      isPublished: nextState,
      editorialStatus: nextState ? 'published' : 'draft',
    });
    if (saved === false) {
      onShowToast('Chưa thể cập nhật trạng thái trên máy chủ.');
      return;
    }
    onShowToast(
      nextState
        ? `Đã xuất bản bài viết "${article.title}" lên Trang Thông Tin Điện Tử Sky First!`
        : `Đã chuyển bài viết "${article.title}" về Bản nháp!`
    );
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    const deleted = await onDeleteArticle(articleToDelete.id);
    if (!deleted) {
      onShowToast('Chưa thể xóa bài viết trên máy chủ.');
      return;
    }
    onShowToast(`Đã xóa bài viết: ${articleToDelete.title}`);
    setArticleToDelete(null);
    if (selectedArticleId === articleToDelete.id) {
      setSelectedArticleId(null);
      setViewMode('list');
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.slug && a.slug.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'published') return a.isPublished !== false;
    if (statusFilter === 'draft') return a.isPublished === false;
    return true;
  });

  // Công cụ kiểm tra chất lượng biên tập (Editorial QA Checklist — Phụ lục Nghiên cứu III.3)
  const editorialQa = useMemo(() => {
    if (!activeArticle) return null;
    const rawHtml =
      activeArticle.contentFormatted ||
      (Array.isArray(activeArticle.content) ? activeArticle.content.join('\n\n') : activeArticle.content || '');
    const plainBody = stripHtmlText(rawHtml);
    const words = plainBody ? plainBody.split(/\s+/).filter(Boolean).length : 0;
    const estimatedMinutes = Math.max(1, Math.ceil(words / 210));
    const titleLen = (activeArticle.title || '').trim().length;
    const sapoLen = (activeArticle.summary || '').trim().length;

    const duplicateTitle = articles.some(
      (other) =>
        other.id !== activeArticle.id &&
        other.title.trim().toLocaleLowerCase('vi') === activeArticle.title.trim().toLocaleLowerCase('vi')
    );

    const combinedText = `${activeArticle.title} ${activeArticle.summary} ${plainBody}`;
    const hasMisleadingLegalTerm = /\b(công ty cổ phần|công ty tnhh|cơ quan nhà nước|tập đoàn sky first)\b/i.test(
      combinedText
    );

    const linkMatches = [...rawHtml.matchAll(/href=["']([^"']*)["']/gi)].map((m) => m[1]);
    const invalidLinks = linkMatches.filter(
      (href) => !href || href === '#' || (!href.startsWith('/') && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
    );

    const checks = [
      {
        id: 'title_len',
        ok: titleLen >= 20 && titleLen <= 120 && !duplicateTitle,
        label: duplicateTitle
          ? 'Cảnh báo: Tiêu đề trùng với một bài viết khác trong hệ thống'
          : `Độ dài tiêu đề (${titleLen} ký tự — khuyến nghị 25–110 ký tự)`,
      },
      {
        id: 'sapo_len',
        ok: sapoLen >= 50 && sapoLen <= 320,
        label: `Đoạn Sapo mở đầu (${sapoLen} ký tự — khuyến nghị 60–280 ký tự)`,
      },
      {
        id: 'cover_meta',
        ok: Boolean(activeArticle.imageUrl && (activeArticle.imageAlt || activeArticle.imageDescription)),
        label: 'Ảnh đại diện kèm chú thích (Caption) và văn bản thay thế (Alt text)',
      },
      {
        id: 'author_date',
        ok: Boolean(activeArticle.author?.trim() && (activeArticle.publishedAt || activeArticle.date) && (activeArticle.tags || []).length > 0),
        label: 'Đầy đủ Tác giả, Ngày đăng và ít nhất 1 Thẻ (Tag)',
      },
      {
        id: 'org_naming',
        ok: !hasMisleadingLegalTerm,
        label: hasMisleadingLegalTerm
          ? 'Phát hiện cách gọi dễ gây hiểu nhầm về tư cách pháp nhân'
          : 'Chuẩn quy tắc tên gọi Mạng lưới & Trang Thông Tin Điện Tử Sky First',
      },
      {
        id: 'links_valid',
        ok: invalidLinks.length === 0,
        label:
          invalidLinks.length === 0
            ? 'Tất cả liên kết trong bài viết đều hợp lệ'
            : `Phát hiện ${invalidLinks.length} liên kết rỗng hoặc sai định dạng`,
      },
    ];

    const passedCount = checks.filter((c) => c.ok).length;
    return {
      words,
      estimatedReadTime: `${estimatedMinutes} phút đọc`,
      checks,
      passedCount,
      totalCount: checks.length,
    };
  }, [activeArticle, articles]);

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 p-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài viết theo tiêu đề, chuyên mục, slug..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'published', 'draft'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                  statusFilter === st ? 'bg-[#0284C7] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {st === 'all' ? 'Tất cả' : st === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Chưa có bài đăng nào</h3>
            <p className="text-xs text-slate-500 mb-5">
              Bắt đầu tạo bài viết tin tức hoặc thông báo đầu tiên cho Trang Thông Tin Điện Tử Sky First.
            </p>
            <button
              type="button"
              id="news-btn-create-first"
              onClick={handleCreateNew}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Thêm mới</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-12 sm:col-span-5">Tiêu đề bài đăng</div>
              <div className="hidden sm:block sm:col-span-2">Nhãn</div>
              <div className="hidden sm:block sm:col-span-2">Tác giả &amp; Thời gian đọc</div>
              <div className="hidden sm:block sm:col-span-3 text-right">Trạng thái &amp; Hành động</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredArticles.map((article) => {
                const isDraft = article.isPublished === false;
                const slug = getArticleSlug(article);
                const displayUrl = `/tin-tuc/${slug}`;

                return (
                  <div
                    key={article.id}
                    id={`news-row-${article.id}`}
                    onClick={() => handleEditClick(article)}
                    className="group grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-sky-50/40 cursor-pointer transition relative"
                  >
                    <div className="col-span-12 sm:col-span-5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            !isDraft ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          title={!isDraft ? 'Đã xuất bản' : 'Bản nháp'}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition truncate">
                            {article.title || 'Bài viết chưa đặt tên'}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">{displayUrl}</p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex sm:col-span-2 items-center flex-wrap gap-1">
                      <EntityBadge
                        label={article.categoryLabel || article.category || 'Tin tức'}
                        color={article.categoryColor}
                        className="rounded-md px-2 py-0.5 text-[10px]"
                      />
                    </div>

                    <div className="hidden sm:block sm:col-span-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                        <User size={12} className="text-[#0284C7] shrink-0" />
                        <span className="truncate">{article.author || 'Ban Truyền thông Sky First Network'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5 truncate">
                        <Clock size={12} className="shrink-0" />
                        <span className="truncate">{article.readTime || '3 phút đọc'}</span>
                      </div>
                    </div>

                    <div className="hidden sm:flex sm:col-span-3 items-center justify-end">
                      <div className="group-hover:hidden text-right">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            !isDraft ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {!isDraft ? 'Đã xuất bản' : article.scheduledPublishAt ? 'Hẹn giờ xuất bản' : 'Bản nháp'}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{article.publishedAt || 'Hôm nay'}</span>
                      </div>

                      <div className="hidden group-hover:flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(article);
                          }}
                          className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition shadow-2xs border border-slate-200 cursor-pointer"
                          title="Chỉnh sửa chi tiết bài viết"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleTogglePublish(article, e)}
                          className={`p-1.5 rounded-lg transition shadow-2xs border cursor-pointer ${
                            !isDraft
                              ? 'text-amber-600 hover:bg-amber-50 border-amber-200 bg-white'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200 bg-white'
                          }`}
                          title={!isDraft ? 'Chuyển về Bản nháp' : 'Xuất bản bài viết công khai'}
                        >
                          {!isDraft ? <Clock size={15} /> : <CheckCircle2 size={15} />}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.history.pushState({}, '', displayUrl);
                            onNavigate('news-detail');
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#0284C7] hover:bg-white rounded-lg transition shadow-2xs border border-slate-200 cursor-pointer"
                          title="Xem bài viết trên website"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setArticleToDelete(article);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition shadow-2xs border border-slate-200 bg-white cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {articleToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Xác Nhận Xóa Bài Đăng?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa bài viết <strong>{articleToDelete.title}</strong>?
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setArticleToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!activeArticle) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Không tìm thấy dữ liệu bài đăng.</p>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const isDraft = activeArticle.isPublished === false;
  const currentSlug = getArticleSlug(activeArticle);
  const displayUrl = `/tin-tuc/${currentSlug}`;

  const patchArticle = (updates: Partial<NewsArticle>) => {
    setDirty(true);
    void onUpdateArticle(activeArticle.id, updates);
  };

  const handleApplyEditorialTemplate = () => {
    const tpl = EDITORIAL_ARTICLE_TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (!tpl) return;
    patchArticle({
      category: tpl.category,
      categoryLabel: tpl.categoryLabel,
      summary: tpl.summaryTemplate,
      content: tpl.htmlTemplate,
      contentFormatted: tpl.htmlTemplate,
      tags: Array.from(new Set([...(activeArticle.tags || []), ...tpl.suggestedTags])),
    });
    onShowToast(`Đã áp dụng mẫu bài viết "${tpl.name}" vào trình soạn thảo!`);
  };

  const handleGenerateSocialSummary = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${displayUrl}` : `https://skyfirst.io.vn${displayUrl}`;
    const hashtags = (activeArticle.tags || []).map((t) => `#${t.replace(/\s+/g, '')}`).join(' ') || '#SkyFirstNetwork #TrangThongTinDienTuSkyFirst';
    const text = `📢 [${(activeArticle.categoryLabel || 'TIN TỨC SKY FIRST').toUpperCase()}] ${activeArticle.title}\n\n${activeArticle.summary}\n\n👉 Đọc chi tiết trên Trang Thông Tin Điện Tử Sky First: ${url}\n\n${hashtags}`;
    setSocialDraft(text);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    onShowToast('Đã tạo và sao chép đoạn giới thiệu chia sẻ mạng xã hội!');
  };

  const handleSave = async (publishState?: boolean) => {
    const finalPublishState = publishState !== undefined ? publishState : !isDraft;
    if (finalPublishState && !activeArticle.title?.trim()) {
      onShowToast('Cảnh báo: Vui lòng nhập tiêu đề bài viết trước khi xuất bản.');
      return;
    }
    const saved = await onUpdateArticle(activeArticle.id, {
      isPublished: finalPublishState,
      editorialStatus: finalPublishState ? 'published' : activeArticle.editorialStatus || 'draft',
    });
    if (saved === false) {
      onShowToast('Chưa thể lưu lên máy chủ. Nội dung vẫn được giữ để bạn thử lại.');
      return;
    }
    setDirty(false);
    if (finalPublishState) {
      onShowToast(`Đã lưu và xuất bản bài viết "${activeArticle.title}" lên Trang Thông Tin Điện Tử Sky First!`);
    } else {
      onShowToast(`Đã lưu bản nháp bài viết "${activeArticle.title}"!`);
    }
  };

  const rawContent =
    activeArticle.contentFormatted ||
    (Array.isArray(activeArticle.content) ? activeArticle.content.join('\n\n') : activeArticle.content);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] text-slate-900 flex flex-col font-sans overflow-y-auto">
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (dirty && !confirm('Bạn có thay đổi vừa chỉnh sửa. Quay lại danh sách?')) return;
              setViewMode('list');
            }}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Quay lại danh sách</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                !isDraft
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {!isDraft ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Đã xuất bản</span>
                </>
              ) : (
                <>
                  <Clock size={13} className="text-amber-600" />
                  <span>Bản nháp</span>
                </>
              )}
            </span>

            <span className="text-xs text-sky-700 font-mono bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 font-bold hidden sm:inline">
              {displayUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewDevice((d) => (d === 'desktop' ? 'none' : 'desktop'))}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              previewDevice === 'desktop' ? 'bg-[#071B3A] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Xem trước giao diện Máy tính"
          >
            <Monitor size={14} />
            <span className="hidden lg:inline">Xem trước PC</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewDevice((d) => (d === 'mobile' ? 'none' : 'mobile'))}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              previewDevice === 'mobile' ? 'bg-[#071B3A] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Xem trước giao diện Điện thoại"
          >
            <Smartphone size={14} />
            <span className="hidden lg:inline">Xem trước Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              void loadRevisions(activeArticle.id);
              setShowRevisions(true);
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            title="Lịch sử phiên bản & Khôi phục"
          >
            <History size={14} />
            <span className="hidden md:inline">Phiên bản</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.history.pushState({}, '', displayUrl);
              onNavigate('news-detail');
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Mở trang thật</span>
          </button>

          {isDraft ? (
            <>
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={15} className="text-[#0284C7]" />
                <span>LƯU NHÁP</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>XUẤT BẢN</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Clock size={14} className="text-amber-600" />
                <span>Chuyển về Nháp</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={15} />
                <span>LƯU THAY ĐỔI</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 flex-1">
        {/* KHỐI 0: 12 MẪU BÀI VIẾT THEO MỤC ĐÍCH & TRỢ LÝ KIỂM TRA CHẤT LƯỢNG BÀI VIẾT (PHỤ LỤC NGHIÊN CỨU III.2 & III.3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-sky-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0B66C3] flex items-center gap-2">
                <LayoutTemplate size={15} />
                <span>Thư viện 12 Mẫu Bài Viết Theo Mục Đích</span>
              </h2>
              <span className="text-[11px] font-bold text-slate-400">Chuẩn báo chí &amp; tổ chức</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                aria-label="Chọn mẫu bài viết theo mục đích"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              >
                {EDITORIAL_ARTICLE_TEMPLATES.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleApplyEditorialTemplate}
                className="px-4 py-2 bg-[#0B66C3] hover:bg-[#084F99] text-white text-xs font-extrabold rounded-xl transition shrink-0 cursor-pointer"
              >
                Áp dụng mẫu
              </button>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {EDITORIAL_ARTICLE_TEMPLATES.find((t) => t.id === selectedTemplateId)?.description}
            </p>
          </div>

          {editorialQa && (
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-600" />
                  <span>Kiểm Tra Chất Lượng ({editorialQa.passedCount}/{editorialQa.totalCount})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => patchArticle({ readTime: editorialQa.estimatedReadTime })}
                  className="text-[11px] font-bold text-[#0284C7] hover:underline"
                  title="Cập nhật thời gian đọc tự động"
                >
                  {editorialQa.words} từ • {editorialQa.estimatedReadTime}
                </button>
              </div>

              <ul className="space-y-1.5 text-[11px]">
                {editorialQa.checks.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className={`mt-0.5 shrink-0 ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {item.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    </span>
                    <span className={item.ok ? 'text-slate-600' : 'text-slate-900 font-semibold'}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* KHỐI 1: TIÊU ĐỀ, ĐƯỜNG DẪN & LỊCH XUẤT BẢN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <LinkIcon size={15} className="text-[#0284C7]" />
              Khối 1: Tiêu đề, Chuyên mục, Thẻ &amp; Lịch xuất bản
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">/tin-tuc/:slug</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Tiêu Đề Bài Viết / Bản Tin <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={activeArticle.title}
                onChange={(e) => {
                  const title = e.target.value;
                  patchArticle({
                    title,
                    slug: activeArticle.isPublished === true ? activeArticle.slug : generateSlug(title),
                  });
                }}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <LinkIcon size={13} className="text-[#0284C7]" />
                  Đường Dẫn Tĩnh (Slug)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-2 rounded-xl border border-slate-200 shrink-0">
                    /tin-tuc/
                  </span>
                  <input
                    type="text"
                    value={activeArticle.slug || generateSlug(activeArticle.title)}
                    onChange={(e) => patchArticle({ slug: generateSlug(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Chuyên Mục Bài Viết</label>
                <select
                  value={activeArticle.category}
                  onChange={(e) => {
                    const category = e.target.value;
                    const found = taxonomyOptions.find((x: any) => x.id === category);
                    patchArticle({ category, categoryLabel: found?.label || category });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  {taxonomyOptions.map((x: any) => (
                    <option key={x.id} value={x.id}>
                      {x.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Trạng Thái Quy Trình Biên Tập
                </label>
                <select
                  value={activeArticle.editorialStatus || (activeArticle.isPublished ? 'published' : 'draft')}
                  onChange={(e) => patchArticle({ editorialStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="pending_review">Chờ duyệt (Pending Review)</option>
                  <option value="approved">Đã duyệt chờ đăng (Approved)</option>
                  <option value="published">Đã xuất bản (Published)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Hẹn Giờ Tự Động Xuất Bản (Tùy chọn)
                </label>
                <input
                  type="datetime-local"
                  value={activeArticle.scheduledPublishAt || ''}
                  onChange={(e) => patchArticle({ scheduledPublishAt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <EntityColorPicker
              label="Màu chuyên mục bài viết"
              entityLabel={activeArticle.categoryLabel || activeArticle.category || 'Tin tức'}
              value={activeArticle.categoryColor}
              onChange={(categoryColor) => patchArticle({ categoryColor })}
            />

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Tag size={13} className="text-[#0284C7]" />
                Thẻ Nhãn (Tags - Phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={activeArticle.tags?.join(', ') || ''}
                onChange={(e) => {
                  const tagsArr = e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  patchArticle({ tags: tagsArr });
                }}
                placeholder="Ví dụ: Thông Báo, Tình Nguyện, Sky First Network 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 2: TÁC GIẢ & THỜI GIAN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <User size={13} className="text-[#0284C7]" /> Tác Giả / Đơn Vị Đăng
              </label>
              <input
                type="text"
                value={activeArticle.author}
                onChange={(e) => patchArticle({ author: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Calendar size={13} className="text-[#0284C7]" /> Ngày Xuất Bản
              </label>
              <input
                type="date"
                value={activeArticle.publishedAt || ''}
                onChange={(e) => patchArticle({ publishedAt: e.target.value, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Clock size={13} className="text-[#0284C7]" /> Thời Gian Đọc
              </label>
              <input
                type="text"
                value={activeArticle.readTime}
                onChange={(e) => patchArticle({ readTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">
            <input
              type="checkbox"
              checked={Boolean(activeArticle.isFeatured)}
              onChange={(e) => patchArticle({ isFeatured: e.target.checked })}
            />
            Ghim là bài đăng nổi bật trên Trang chủ &amp; Trang Tin tức
          </label>
        </div>

        {/* KHỐI 3: HÌNH ẢNH ĐẠI DIỆN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ImageIcon size={15} className="text-[#0284C7]" />
              Khối 3: Hình Ảnh Đại Diện &amp; Thư Viện Ảnh (Mặc định giữ nguyên tỷ lệ gốc)
            </h2>
          </div>

          <ImageUrlInput
            label="Ảnh đại diện bài viết"
            value={activeArticle.imageUrl || ''}
            onChange={(url) => patchArticle({ imageUrl: url })}
            helperText="Mặc định hiển thị đầy đủ 100% ảnh gốc (kể cả ảnh dọc A4, infographic, poster). Chỉ cắt khi bạn chủ động chọn Cover."
          />

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={activeArticle.imageDescription || ''}
              onChange={(e) => patchArticle({ imageDescription: e.target.value, imageCaption: e.target.value })}
              placeholder="Chú thích ảnh hiển thị dưới ảnh..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <input
              value={activeArticle.imageAlt || ''}
              onChange={(e) => patchArticle({ imageAlt: e.target.value })}
              placeholder="Văn bản thay thế (Alt text cho SEO & trợ năng)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <input
              value={activeArticle.imageCredit || ''}
              onChange={(e) => patchArticle({ imageCredit: e.target.value })}
              placeholder="Nguồn / Tác giả ảnh"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <select
              value={activeArticle.imageFit || 'original'}
              onChange={(e) => patchArticle({ imageFit: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="original">Original — Hiển thị đầy đủ ảnh gốc, giữ nguyên tỷ lệ</option>
              <option value="contain">Contain — Vừa khung, không bao giờ cắt ảnh</option>
              <option value="cover">Cover — Chủ động phủ khung 16:9</option>
            </select>
          </div>
        </div>

        {/* KHỐI 4: ĐOẠN SAPO & TRÌNH SOẠN THẢO KIỂU WORDPRESS GUTENBERG */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Đoạn Sapo / Tóm Tắt Mở Đầu
            </label>
            <textarea
              rows={3}
              value={activeArticle.summary}
              onChange={(e) => patchArticle({ summary: e.target.value })}
              placeholder="Nhập đoạn sapo tóm tắt mở đầu bài viết..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Trình Soạn Thảo Nội Dung &amp; Khối Kiểu WordPress Gutenberg
            </label>
            <RichTextEditor
              id="news-content-editor"
              value={rawContent}
              onChange={(html) => {
                const words = stripHtmlText(html).split(/\s+/).filter(Boolean).length;
                const mins = Math.max(1, Math.ceil(words / 210));
                patchArticle({
                  contentFormatted: html,
                  content: html,
                  readTime: `${mins} phút đọc`,
                });
              }}
              blocks={activeArticle.pageBlocks || []}
              onBlocksChange={(pageBlocks) => patchArticle({ pageBlocks })}
              placeholder="Viết trực tiếp tại đây, kéo thả ảnh từ máy tính vào bài hoặc bấm (+ Thêm khối)..."
              minHeight="420px"
            />
          </div>
        </div>

        {/* KHỐI 5: SEO, METADATA CHIA SẺ & NGUỒN TIN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Globe size={15} className="text-[#0284C7]" />
              Khối 5: SEO, Chia Sẻ Mạng Xã Hội &amp; Bình Luận
            </h2>
            <button
              type="button"
              onClick={handleGenerateSocialSummary}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-bold text-[#0B66C3] hover:bg-sky-100 transition cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Tạo bản tóm tắt chia sẻ MXH</span>
            </button>
          </div>

          {socialDraft && (
            <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                <span>Bản nháp giới thiệu bài viết lên Fanpage / Mạng xã hội:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(socialDraft);
                    onShowToast('Đã sao chép nội dung giới thiệu mạng xã hội!');
                  }}
                  className="inline-flex items-center gap-1 text-[#0B66C3] hover:underline"
                >
                  <Copy size={12} /> Sao chép
                </button>
              </div>
              <textarea
                rows={4}
                value={socialDraft}
                onChange={(e) => setSocialDraft(e.target.value)}
                className="w-full rounded-lg border border-sky-200 bg-white p-2.5 text-xs text-slate-800"
              />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-700">SEO Title (Mặc định lấy tiêu đề bài)</span>
              <input
                value={activeArticle.seoTitle || ''}
                onChange={(e) => patchArticle({ seoTitle: e.target.value })}
                placeholder={activeArticle.title}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700">Nguồn trích dẫn / Canonical URL</span>
              <input
                value={activeArticle.source || ''}
                onChange={(e) => patchArticle({ source: e.target.value })}
                placeholder="Trang Thông Tin Điện Tử Sky First / Ban Truyền Thông"
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-bold text-slate-700">SEO Description (Mặc định lấy đoạn Sapo)</span>
              <textarea
                rows={2}
                value={activeArticle.seoDescription || ''}
                onChange={(e) => patchArticle({ seoDescription: e.target.value })}
                placeholder={activeArticle.summary}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={activeArticle.allowComments ?? true}
                onChange={(e) => patchArticle({ allowComments: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600"
              />
              <span>Cho phép độc giả gửi bình luận (qua kiểm duyệt)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(activeArticle.noIndex)}
                onChange={(e) => patchArticle({ noIndex: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600"
              />
              <span>Ẩn khỏi công cụ tìm kiếm &amp; Sitemap (noIndex)</span>
            </label>
          </div>
        </div>
      </main>

      {/* Modal Xem trước Desktop / Mobile ngay trong trình biên tập */}
      {previewDevice !== 'none' && (
        <div className="fixed inset-0 z-[130] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
              previewDevice === 'mobile' ? 'w-[390px]' : 'w-full max-w-4xl'
            }`}
          >
            <header className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#0B66C3]">
                  Xem trước ({previewDevice === 'mobile' ? 'Điện thoại 390px' : 'Máy tính'})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    previewDevice === 'desktop' ? 'bg-[#0B66C3] text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  Máy tính
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    previewDevice === 'mobile' ? 'bg-[#0B66C3] text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  Điện thoại
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('none')}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>
            </header>
            <div className="p-6 overflow-y-auto space-y-4">
              <EntityBadge label={activeArticle.categoryLabel || 'Tin tức'} color={activeArticle.categoryColor} />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{activeArticle.title}</h1>
              <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                <span>{activeArticle.author}</span>
                <span>•</span>
                <span>{activeArticle.date}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>
              {activeArticle.summary && (
                <div className="p-4 rounded-2xl bg-sky-50/70 border-l-4 border-[#0284C7] text-sm font-semibold text-slate-800">
                  {activeArticle.summary}
                </div>
              )}
              {activeArticle.imageUrl && (
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.imageAlt || activeArticle.title}
                  className="w-auto max-w-full h-auto mx-auto rounded-2xl object-contain"
                />
              )}
              <div className="pt-2">
                <RichTextRenderer content={rawContent} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showRevisions && (
        <div className="fixed inset-0 z-[120] bg-slate-950/55 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <header className="p-4 border-b flex items-center justify-between">
              <h3 className="font-black text-sm">Lịch sử phiên bản bài viết</h3>
              <button type="button" onClick={() => setShowRevisions(false)} className="text-xs font-bold text-slate-500">
                Đóng
              </button>
            </header>
            <div className="max-h-96 overflow-y-auto divide-y p-3">
              {revisions.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-500">Chưa có bản lưu lịch sử nào cho bài viết này.</p>
              ) : (
                revisions.map((r) => (
                  <div key={r.id} className="py-3 px-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{r.version_label || r.id}</div>
                      <div className="text-[11px] text-slate-500">{r.created_at} · bởi {r.created_by}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void restoreRevision(r.id)}
                      className="rounded-lg bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-bold text-sky-700"
                    >
                      Khôi phục
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
