export const RESOURCES = {
  pages: {
    table: 'pages', label: 'Trang',
    fields: ['translation_group','lang','slug','title','excerpt','body_html','status','public','seo_title','seo_description','og_image','published_at','scheduled_at']
  },
  posts: {
    table: 'posts', label: 'Bài viết',
    fields: ['translation_group','lang','slug','title','excerpt','body_html','featured_image','category_id','unit_id','author_name','status','public','seo_title','seo_description','og_image','published_at','scheduled_at']
  },
  categories: { table: 'categories', label: 'Chuyên mục', fields: ['name','slug','description','public','sort_order'] },
  programs: { table: 'programs', label: 'Chương trình/Dự án', fields: ['name','slug','summary','body_html','unit_id','status','registration_url','start_date','end_date','featured_image','public','sort_order'] },
  classes: { table: 'classes', label: 'Lớp học', fields: ['name','slug','audience','objective','format','schedule_text','duration_text','unit_id','program_id','status','registration_url','public'] },
  activities: { table: 'activities', label: 'Hoạt động', fields: ['title','slug','summary','body_html','location_text','start_at','end_at','unit_id','featured_image','status','public'] },
  units: { table: 'site_units', label: 'Đơn vị trực thuộc', fields: ['code','name','official_name','english_name','description','logo_url','website_url','contact_email','status','public','sort_order'] },
  team_members: { table: 'team_members', label: 'Nhân sự công khai', fields: ['name','title','unit_id','bio','photo_url','public','sort_order','status'] },
  partners: { table: 'site_partners', label: 'Đối tác', fields: ['name','description','logo_url','website_url','relationship_status','public','sort_order'] },
  albums: { table: 'albums', label: 'Thư viện hình ảnh', fields: ['title','slug','description','unit_id','program_id','activity_id','cover_url','status','public'] },
  documents: { table: 'documents', label: 'Tài liệu', fields: ['title','slug','description','media_id','category','status','public','published_at'] },
  certificates: {
    table: 'site_certificates', label: 'GCN/Tra cứu',
    fields: ['certificate_code','verification_token','recipient_name','title','issuer_unit','program_name','role_recognition','issue_date','valid_until','issuing_system','status','public_pdf_url','qr_url','revocation_note'],
    readonlyCreate: true
  },
  forms: { table: 'site_forms', label: 'Biểu mẫu/Đăng ký', fields: ['form_type','name','email','phone','organization','program_id','message','consent','status'], readonlyCreate: true },
  menus: { table: 'site_menus', label: 'Menu', fields: ['location','label','url','parent_id','sort_order','visible','new_tab','lang'], orderBy: 'location,lang,parent_id IS NOT NULL,parent_id,sort_order,id' },
  portals: { table: 'site_portals', label: 'Hệ thống Sky First', fields: ['code','name','subtitle','url','description','status','public','show_footer','sort_order'] },
  languages: { table: 'site_languages', label: 'Ngôn ngữ', idField: 'code', fields: ['name','native_name','direction','enabled','is_default','sort_order'], orderBy: 'sort_order,code', noDelete: true },
  media: { table: 'site_media', label: 'Media', fields: ['filename','alt_text','caption','album_id','public'], readonlyCreate: true },
  ui_strings: { table: 'site_ui_strings', label: 'Chuỗi giao diện đa ngôn ngữ', fields: ['lang','key','value','status'], orderBy: 'lang,key' },
  settings: {
    table: 'site_settings', label: 'Cài đặt, Giao diện, Footer & SEO', idField: 'key',
    fields: ['key','value','group_name','value_type','is_public'], orderBy: 'group_name,key', noDelete: true
  },
  issuer_keys: {
    table: 'issuer_api_keys', label: 'Khóa cấp GCN',
    fields: [], select: 'id,issuer_name,key_prefix,active,created_at,last_used_at',
    readOnly: true, orderBy: 'id DESC'
  },
  admins: {
    table: 'site_admins', label: 'Tài khoản quản trị',
    fields: ['email','name','role','active'], select: 'id,email,name,role,active,created_at,updated_at,last_login_at'
  },
  audit_log: { table: 'site_audit_log', label: 'Nhật ký/Audit', fields: [], readOnly: true, orderBy: 'id DESC' }
};

export function resource(name) {
  return RESOURCES[name] || null;
}
