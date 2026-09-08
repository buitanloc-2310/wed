import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  User,
  Calendar,
} from 'lucide-react';
import { CustomPage, CorePillar, TimelineMilestone, TeamMember, CoreValueItem } from '../../types';
import { CORE_PILLARS, CORE_VALUES, TIMELINE_DATA, TEAM_DATA } from '../../data/mockData';
import { generateSlug } from '../../utils/slug';
import { AboutEditorFields } from './editor-fields/AboutEditorFields';
import { CertificateEditorFields } from './editor-fields/CertificateEditorFields';
import { SponsorEditorFields } from './editor-fields/SponsorEditorFields';
import { JoinEditorFields } from './editor-fields/JoinEditorFields';
import { ContactEditorFields } from './editor-fields/ContactEditorFields';
import { StandardEditorFields } from './editor-fields/StandardEditorFields';

interface StandalonePageEditorProps {
  page: CustomPage;
  onSave: (updatedPage: Partial<CustomPage>) => void;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const StandalonePageEditor: React.FC<StandalonePageEditorProps> = ({
  page,
  onSave,
  onClose,
  onShowToast,
}) => {
  // Page Type flags
  const isAboutPage = page.slug === 'about' || page.type === 'about';
  const isCertificatePage = page.slug === 'certificate' || page.type === 'certificate';
  const isSponsorPage = page.slug === 'sponsor' || page.type === 'sponsor';
  const isJoinPage = page.slug === 'join' || page.type === 'join';
  const isContactPage = page.slug === 'contact' || page.type === 'contact';

  // 1. Common Basic States
  const [title, setTitle] = useState(page.title || '');
  const [slug, setSlug] = useState(page.slug || '');
  const [badge, setBadge] = useState(page.badge || '');
  const [summary, setSummary] = useState(page.summary || '');
  const [content, setContent] = useState(page.contentFormatted || page.content || '');
  const [imageUrl, setImageUrl] = useState(page.imageUrl || '');
  const [secondaryImageUrl, setSecondaryImageUrl] = useState(page.secondaryImageUrl || '');
  const [author, setAuthor] = useState(page.author || 'Ban Quản trị Sky First Network');
  const [publishedAt, setPublishedAt] = useState(
    page.publishedAt || new Date().toLocaleDateString('vi-VN')
  );
  const [isPublished, setIsPublished] = useState<boolean>(page.isPublished === true);
  const [showInFooter, setShowInFooter] = useState<boolean>(page.showInFooter !== false);

  // Common Action Buttons (Tên nút và liên kết trỏ đến)
  const [buttonLabel, setButtonLabel] = useState(page.buttonLabel || '');
  const [buttonUrl, setButtonUrl] = useState(page.buttonUrl || '');
  const [secondaryButtonLabel, setSecondaryButtonLabel] = useState(page.secondaryButtonLabel || '');
  const [secondaryButtonUrl, setSecondaryButtonUrl] = useState(page.secondaryButtonUrl || '');

  // 2. About Page specific states
  const [visionBadge, setVisionBadge] = useState(page.visionBadge || 'Định Hướng Chiến Lược');
  const [visionTitle, setVisionTitle] = useState(page.visionTitle || 'Tầm Nhìn 2030');
  const [visionContent, setVisionContent] = useState(
    page.visionContent ||
      'Nội dung tầm nhìn được cập nhật theo tài liệu chính thức của Sky First Network.'
  );
  const [missionBadge, setMissionBadge] = useState(page.missionBadge || 'Mục Tiêu Hành Động');
  const [missionTitle, setMissionTitle] = useState(page.missionTitle || 'Sứ Mệnh Phụng Sự');
  const [missionContent, setMissionContent] = useState(
    page.missionContent ||
      'Nội dung sứ mệnh được cập nhật theo tài liệu chính thức của Sky First Network.'
  );
  const [philosophyBadge, setPhilosophyBadge] = useState(page.philosophyBadge || 'Giá Trị Cốt Lõi');
  const [philosophyTitle, setPhilosophyTitle] = useState(page.philosophyTitle || 'Triết Lý Cốt Lõi');
  const [philosophyContent, setPhilosophyContent] = useState(
    page.philosophyContent ||
      '"Học để Phụng sự - Phụng sự để Trưởng thành". Sự tiến bộ của từng cá nhân gắn liền mật thiết với giá trị mà bạn đem lại cho cộng đồng xung quanh.'
  );
  // About Page: Pillars
  const [pillarsSectionTitle, setPillarsSectionTitle] = useState(
    page.pillarsSectionTitle || '5 Trụ Cột Hoạt Động Cốt Lõi'
  );
  const [pillarsSectionBadge, setPillarsSectionBadge] = useState(
    page.pillarsSectionBadge || 'Định Hướng Chiến Lược'
  );
  const [customPillars, setCustomPillars] = useState<CorePillar[]>(
    page.customPillars && page.customPillars.length > 0 ? page.customPillars : [...CORE_PILLARS]
  );

  // About Page: Values
  const [valuesSectionTitle, setValuesSectionTitle] = useState(
    page.valuesSectionTitle || 'Giá Trị Cốt Lõi'
  );
  const [customValues, setCustomValues] = useState<CoreValueItem[]>(
    page.customValues && page.customValues.length > 0 ? page.customValues : [...CORE_VALUES]
  );

  // About Page: Timeline
  const [timelineSectionTitle, setTimelineSectionTitle] = useState(
    page.timelineSectionTitle || 'Hành Trình Phát Triển'
  );
  const [timelineSectionBadge, setTimelineSectionBadge] = useState(
    page.timelineSectionBadge || '2024 - 2026'
  );
  const [customTimeline, setCustomTimeline] = useState<TimelineMilestone[]>(
    page.customTimeline && page.customTimeline.length > 0 ? page.customTimeline : [...TIMELINE_DATA]
  );

  // About Page: Team
  const [teamSectionTitle, setTeamSectionTitle] = useState(
    page.teamSectionTitle || 'Đội Ngũ Lãnh Đạo'
  );
  const [teamSectionSubtitle, setTeamSectionSubtitle] = useState(
    page.teamSectionSubtitle || 'Ban Chấp hành Sky First Network'
  );
  const [customTeam, setCustomTeam] = useState<TeamMember[]>(
    page.customTeam && page.customTeam.length > 0 ? page.customTeam : [...TEAM_DATA]
  );

  // About Page: Units
  const [unitsSectionBadge, setUnitsSectionBadge] = useState(
    page.unitsSectionBadge || 'Hệ Thống Đơn Vị Trực Thuộc'
  );
  const [unitsSectionTitle, setUnitsSectionTitle] = useState(
    page.unitsSectionTitle || 'Đơn vị trực thuộc Sky First Network'
  );
  const [unitsButtonLabel, setUnitsButtonLabel] = useState(
    page.unitsButtonLabel || 'Xem chi tiết tất cả đơn vị'
  );
  const [unitsButtonUrl, setUnitsButtonUrl] = useState(page.unitsButtonUrl || '/units');
  const [ctaTitle, setCtaTitle] = useState(page.ctaTitle || 'Kết nối cùng Sky First Network');
  const [ctaDescription, setCtaDescription] = useState(
    page.ctaDescription ||
      'Dù bạn là học viên, tình nguyện viên hay đối tác tổ chức, cánh cửa của Sky First Network luôn rộng mở đón chào bạn.'
  );

  // 3. Certificate Page specific states
  const [certSearchLabel, setCertSearchLabel] = useState(
    page.certSearchLabel || 'Mã Tra Cứu Chứng Nhận'
  );
  const [certSearchPlaceholder, setCertSearchPlaceholder] = useState(
    page.certSearchPlaceholder || 'Nhập mã Giấy chứng nhận'
  );
  const [certGuidanceNote, setCertGuidanceNote] = useState(
    page.certGuidanceNote ||
      'Hệ thống tra cứu tự động đối chiếu mã số với cơ sở dữ liệu số hóa hệ thống Giấy chứng nhận theo thời gian thực.'
  );
  const [certSearchButtonLabel, setCertSearchButtonLabel] = useState(
    page.certSearchButtonLabel || 'Tra Cứu'
  );
  const [certResetButtonLabel, setCertResetButtonLabel] = useState(
    page.certResetButtonLabel || 'Làm mới'
  );
  const [certFeature1Title, setCertFeature1Title] = useState(
    page.certFeature1Title || 'Mã Định Danh Duy Nhất'
  );
  const [certFeature1Desc, setCertFeature1Desc] = useState(
    page.certFeature1Desc ||
      'Mỗi Giấy chứng nhận được ghi nhận bằng một mã phục vụ việc tra cứu và đối chiếu thông tin.'
  );
  const [certFeature2Title, setCertFeature2Title] = useState(
    page.certFeature2Title || 'Lưu Trữ Vĩnh Viễn'
  );
  const [certFeature2Desc, setCertFeature2Desc] = useState(
    page.certFeature2Desc ||
      'Hồ sơ được lưu trữ trên cơ sở dữ liệu số của Sky First Network phục vụ việc đối chiếu thông tin.'
  );
  const [certFeature3Title, setCertFeature3Title] = useState(
    page.certFeature3Title || 'Hỗ Trợ Nhanh Chóng'
  );
  const [certFeature3Desc, setCertFeature3Desc] = useState(
    page.certFeature3Desc ||
      'Cần xác minh bổ sung hoặc chỉnh sửa thông tin, vui lòng gửi yêu cầu qua trang Liên hệ.'
  );
  const [certCtaTitle, setCertCtaTitle] = useState(
    page.certCtaTitle || 'Bạn cần hỗ trợ tra cứu hoặc cấp lại chứng nhận?'
  );
  const [certCtaDescription, setCertCtaDescription] = useState(
    page.certCtaDescription ||
      'Đội ngũ điều phối và kỹ thuật viên hệ thống Giấy chứng nhận luôn sẵn sàng giải đáp và xử lý yêu cầu xác minh thông tin.'
  );
  const [certCtaButtonLabel, setCertCtaButtonLabel] = useState(
    page.certCtaButtonLabel || 'Gửi Yêu Cầu Hỗ Trợ'
  );
  const [certCtaButtonUrl, setCertCtaButtonUrl] = useState(
    page.certCtaButtonUrl || '/contact'
  );

  // 4. Sponsor Page specific states
  // 4.1 Hero Buttons
  const [sponsorHeroPrimaryButtonLabel, setSponsorHeroPrimaryButtonLabel] = useState(
    page.sponsorHeroPrimaryButtonLabel || 'Đăng Ký Tài Trợ Ngay'
  );
  const [sponsorHeroPrimaryButtonUrl, setSponsorHeroPrimaryButtonUrl] = useState(
    page.sponsorHeroPrimaryButtonUrl || '/contact'
  );
  const [sponsorHeroSecondaryButtonLabel, setSponsorHeroSecondaryButtonLabel] = useState(
    page.sponsorHeroSecondaryButtonLabel || 'Thông Tin Chuyển Khoản'
  );
  const [sponsorHeroSecondaryButtonUrl, setSponsorHeroSecondaryButtonUrl] = useState(
    page.sponsorHeroSecondaryButtonUrl || '#thong-tin-chuyen-khoan'
  );

  // 4.2 Commitments
  const [sponsorCommitmentHeading, setSponsorCommitmentHeading] = useState(
    page.sponsorCommitmentHeading || '4 Cam Kết Minh Bạch Dành Cho Nhà Tài Trợ'
  );
  const [sponsorCommitmentSubtitle, setSponsorCommitmentSubtitle] = useState(
    page.sponsorCommitmentSubtitle ||
      'Mọi nguồn lực quý báu được quý đối tác gửi gắm đều được quản lý với tiêu chuẩn trách nhiệm cao nhất.'
  );
  const [sponsorCommit1Title, setSponsorCommit1Title] = useState(
    page.sponsorCommit1Title || 'Minh bạch theo thông tin được xác nhận'
  );
  const [sponsorCommit1Desc, setSponsorCommit1Desc] = useState(
    page.sponsorCommit1Desc ||
      'Cập nhật thu - chi rõ ràng theo từng dự án cụ thể, lưu trữ chứng từ hóa đơn đầy đủ và minh bạch.'
  );
  const [sponsorCommit2Title, setSponsorCommit2Title] = useState(
    page.sponsorCommit2Title || 'Giấy chứng nhận'
  );
  const [sponsorCommit2Desc, setSponsorCommit2Desc] = useState(
    page.sponsorCommit2Desc ||
      'Việc ghi nhận hoặc cấp Giấy chứng nhận, nếu có, phụ thuộc vào từng chương trình và thông tin được công bố chính thức.'
  );
  const [sponsorCommit3Title, setSponsorCommit3Title] = useState(
    page.sponsorCommit3Title || 'Báo Cáo Tác Động Thực'
  );
  const [sponsorCommit3Desc, setSponsorCommit3Desc] = useState(
    page.sponsorCommit3Desc ||
      'Gửi tận tay nhà tài trợ báo cáo hình ảnh, video và số liệu thụ hưởng thực tế sau khi dự án hoàn thành.'
  );
  const [sponsorCommit4Title, setSponsorCommit4Title] = useState(
    page.sponsorCommit4Title || 'Lan Tỏa Truyền Thông'
  );
  const [sponsorCommit4Desc, setSponsorCommit4Desc] = useState(
    page.sponsorCommit4Desc ||
      'Đồng hành cùng Trung tâm Truyền thông hoạt động truyền thông để tôn vinh những nghĩa cử nhân văn đến cộng đồng người trẻ.'
  );

  // 4.3 Packages
  const [sponsorPackagesHeading, setSponsorPackagesHeading] = useState(
    page.sponsorPackagesHeading || 'Các hình thức đồng hành cùng Sky First Network'
  );
  const [sponsorPackagesSubtitle, setSponsorPackagesSubtitle] = useState(
    page.sponsorPackagesSubtitle ||
      'Lựa chọn hình thức đóng góp phù hợp với định hướng phát triển và sứ mệnh trách nhiệm xã hội (CSR) của quý đơn vị.'
  );
  const [sponsorPkg1Title, setSponsorPkg1Title] = useState(
    page.sponsorPkg1Title || 'Học Bổng Tri Thức & Kỹ Năng'
  );
  const [sponsorPkg1Badge, setSponsorPkg1Badge] = useState(
    page.sponsorPkg1Badge || 'BẢO TRỢ ĐÀO TẠO'
  );
  const [sponsorPkg1Unit, setSponsorPkg1Unit] = useState(
    page.sponsorPkg1Unit || 'Đồng hành cùng SFEC & hoạt động nghiên cứu'
  );
  const [sponsorPkg1Desc, setSponsorPkg1Desc] = useState(
    page.sponsorPkg1Desc ||
      'Tài trợ học bổng các khóa đào tạo kỹ năng thực chiến, chuyển đổi số và công nghệ cho học sinh, sinh viên có hoàn cảnh khó khăn hoặc tài năng trẻ.'
  );
  const [sponsorPkg1Impact, setSponsorPkg1Impact] = useState(
    page.sponsorPkg1Impact ||
      '100% học bổng được trao trực tiếp, kèm báo cáo tiến độ học tập của từng học viên.'
  );

  const [sponsorPkg2Title, setSponsorPkg2Title] = useState(
    page.sponsorPkg2Title || 'Chiến Dịch Phụng Sự Cộng Đồng'
  );
  const [sponsorPkg2Badge, setSponsorPkg2Badge] = useState(
    page.sponsorPkg2Badge || 'TÁC ĐỘNG XÃ HỘI'
  );
  const [sponsorPkg2Unit, setSponsorPkg2Unit] = useState(
    page.sponsorPkg2Unit || 'Đồng hành cùng hoạt động tình nguyện (Tình nguyện)'
  );
  const [sponsorPkg2Desc, setSponsorPkg2Desc] = useState(
    page.sponsorPkg2Desc ||
      'Bảo trợ kinh phí tổ chức các chiến dịch thiện nguyện quy mô lớn: Chiến dịch Mùa Hè Xanh, Tình Nguyện Đông Xuân, Xây dựng Tủ sách Vùng cao và Khám bệnh lưu động.'
  );
  const [sponsorPkg2Impact, setSponsorPkg2Impact] = useState(
    page.sponsorPkg2Impact ||
      'Trực tiếp mang tri thức, nước sạch và quà tặng thiết thực đến các điểm trường nghèo khó.'
  );

  const [sponsorPkg3Title, setSponsorPkg3Title] = useState(
    page.sponsorPkg3Title || 'Tài Trợ Hiện Vật & Cơ Sở Hạ Tầng'
  );
  const [sponsorPkg3Badge, setSponsorPkg3Badge] = useState(
    page.sponsorPkg3Badge || 'HỖ TRỢ THIẾT BỊ'
  );
  const [sponsorPkg3Unit, setSponsorPkg3Unit] = useState(
    page.sponsorPkg3Unit || 'Đồng hành cùng hoạt động truyền thông & hệ thống Giấy chứng nhận'
  );
  const [sponsorPkg3Desc, setSponsorPkg3Desc] = useState(
    page.sponsorPkg3Desc ||
      'Hỗ trợ máy tính, thiết bị âm thanh, phòng hội thảo, tài khoản phần mềm, sách giáo khoa hoặc phương tiện di chuyển phục vụ công tác xã hội.'
  );
  const [sponsorPkg3Impact, setSponsorPkg3Impact] = useState(
    page.sponsorPkg3Impact ||
      'Tối ưu hóa nguồn lực vận hành, nâng cao chất lượng trải nghiệm học tập và công tác thiện nguyện.'
  );

  const [sponsorPkg4Title, setSponsorPkg4Title] = useState(
    page.sponsorPkg4Title || 'Hợp tác dài hạn'
  );
  const [sponsorPkg4Badge, setSponsorPkg4Badge] = useState(
    page.sponsorPkg4Badge || 'ĐỒNG HÀNH TOÀN DIỆN'
  );
  const [sponsorPkg4Unit, setSponsorPkg4Unit] = useState(
    page.sponsorPkg4Unit || 'Đồng hành cùng Ban Chấp hành Sky First Network'
  );
  const [sponsorPkg4Desc, setSponsorPkg4Desc] = useState(
    page.sponsorPkg4Desc ||
      'Trao đổi và thống nhất phạm vi hợp tác phù hợp theo từng chương trình hoặc nhu cầu thực tế.'
  );
  const [sponsorPkg4Impact, setSponsorPkg4Impact] = useState(
    page.sponsorPkg4Impact ||
      'Xây dựng giá trị Trách nhiệm Xã hội Doanh nghiệp (CSR) bền vững và dài hạn.'
  );

  // 4.4 Bank details & contacts
  const [sponsorBankName, setSponsorBankName] = useState(
    page.sponsorBankName || 'Ngân hàng Quân Đội (MB Bank)'
  );
  const [sponsorBankAccount, setSponsorBankAccount] = useState(
    page.sponsorBankAccount || ''
  );
  const [sponsorAccountHolder, setSponsorAccountHolder] = useState(
    page.sponsorAccountHolder || 'Sky First Network'
  );
  const [sponsorBankBranch, setSponsorBankBranch] = useState(
    page.sponsorBankBranch || 'Chi nhánh TP. Hồ Chí Minh'
  );
  const [sponsorTransferSyntax, setSponsorTransferSyntax] = useState(
    page.sponsorTransferSyntax || 'TAITRO [HọTên/TênDoanhNghiệp] [SốĐiệnThoại]'
  );
  const [sponsorQrCodeUrl, setSponsorQrCodeUrl] = useState(
    page.sponsorQrCodeUrl || ''
  );
  const [sponsorQrCodeTitle, setSponsorQrCodeTitle] = useState(
    page.sponsorQrCodeTitle || 'VietQR Chuyển Khoản Nhanh'
  );
  const [sponsorQrCodeSubtitle, setSponsorQrCodeSubtitle] = useState(
    page.sponsorQrCodeSubtitle || 'Quét bằng mọi ứng dụng Ngân hàng & Ví điện tử'
  );
  const [sponsorCopyButtonLabel, setSponsorCopyButtonLabel] = useState(
    page.sponsorCopyButtonLabel || 'Sao chép số tài khoản'
  );
  const [sponsorHotline, setSponsorHotline] = useState(page.sponsorHotline || '0337 775 329');
  const [sponsorEmail, setSponsorEmail] = useState(page.sponsorEmail || 'hoptac.sfn@gmail.com');
  const [sponsorContactLeadTitle, setSponsorContactLeadTitle] = useState(
    page.sponsorContactLeadTitle || 'Ban Đối ngoại & Sự kiện'
  );
  const [sponsorContactHeading, setSponsorContactHeading] = useState(
    page.sponsorContactHeading || 'Đồng hành & Hợp tác cùng Sky First Network'
  );
  const [sponsorContactDescription, setSponsorContactDescription] = useState(
    page.sponsorContactDescription ||
      'Quý Doanh nghiệp, Tổ chức và Quý Nhà tài trợ vui lòng liên hệ trực tiếp với Ban Đối Ngoại để nhận Hồ sơ Mời Tài trợ, Báo cáo Tài chính Minh bạch hoặc xây dựng các gói CSR phù hợp.'
  );
  const [sponsorContactButtonLabel, setSponsorContactButtonLabel] = useState(
    page.sponsorContactButtonLabel || 'Gửi Đề Xuất Tại Trang Liên Hệ'
  );
  const [sponsorContactButtonUrl, setSponsorContactButtonUrl] = useState(
    page.sponsorContactButtonUrl || '/contact'
  );
  const [sponsorUnitsButtonLabel, setSponsorUnitsButtonLabel] = useState(
    page.sponsorUnitsButtonLabel || 'Xem Chi Tiết 5 Đơn Vị'
  );
  const [sponsorUnitsButtonUrl, setSponsorUnitsButtonUrl] = useState(
    page.sponsorUnitsButtonUrl || '/units'
  );
  const [sponsorContactHotline, setSponsorContactHotline] = useState(
    page.sponsorContactHotline || '0912.838.xxx'
  );
  const [sponsorContactEmail, setSponsorContactEmail] = useState(
    page.sponsorContactEmail || 'hoptac.sfn@gmail.com'
  );

  // 4.5 FAQs
  const [sponsorFaqHeading, setSponsorFaqHeading] = useState(
    page.sponsorFaqHeading || 'Câu hỏi thường gặp về hợp tác & đồng hành'
  );
  const [sponsorFaqSubtitle, setSponsorFaqSubtitle] = useState(
    page.sponsorFaqSubtitle || 'GIẢI ĐÁP THẮC MẮC'
  );
  const [sponsorFaq1Q, setSponsorFaq1Q] = useState(
    page.sponsorFaq1Q || 'Cá nhân có thể đề xuất đồng hành cùng Sky First Network không?'
  );
  const [sponsorFaq1A, setSponsorFaq1A] = useState(
    page.sponsorFaq1A ||
      'Cá nhân hoặc đơn vị có thể gửi đề xuất đồng hành. Phạm vi, hình thức và đầu mối tiếp nhận được thống nhất theo từng chương trình cụ thể.'
  );
  const [sponsorFaq2Q, setSponsorFaq2Q] = useState(
    page.sponsorFaq2Q || 'Làm sao tôi có thể kiểm tra tính minh bạch của số tiền đã tài trợ?'
  );
  const [sponsorFaq2A, setSponsorFaq2A] = useState(
    page.sponsorFaq2A ||
      'Thông tin về tiếp nhận nguồn lực, tài chính hoặc quyền lợi đồng hành chỉ được công bố khi có cơ chế, phạm vi và tài liệu xác nhận phù hợp.'
  );
  const [sponsorFaq3Q, setSponsorFaq3Q] = useState(
    page.sponsorFaq3Q || 'Nhà tài trợ có được cấp Giấy Chứng Nhận chính thức không?'
  );
  const [sponsorFaq3A, setSponsorFaq3A] = useState(
    page.sponsorFaq3A ||
      'Việc ghi nhận hoặc cấp Giấy chứng nhận, nếu có, phụ thuộc vào từng chương trình và thông tin được công bố chính thức.'
  );
  const [sponsorFaq4Q, setSponsorFaq4Q] = useState(
    page.sponsorFaq4Q || 'Doanh nghiệp có được khấu trừ thuế TNDN cho khoản tài trợ này không?'
  );
  const [sponsorFaq4A, setSponsorFaq4A] = useState(
    page.sponsorFaq4A ||
      'Mọi nội dung hợp tác cần được xem xét theo phạm vi thực tế và quy định áp dụng; website không mặc định cam kết tư cách pháp lý, chứng từ hoặc ưu đãi cho bên đồng hành.'
  );

  // 4.6 Quick CTA
  const [sponsorCtaTitle, setSponsorCtaTitle] = useState(
    page.sponsorCtaTitle || 'Bạn muốn trao đổi trực tiếp cùng Ban Chấp hành Sky First Network?'
  );
  const [sponsorCtaDescription, setSponsorCtaDescription] = useState(
    page.sponsorCtaDescription ||
      'Vui lòng gọi hotline đối ngoại hoặc đặt lịch hẹn gặp trực tiếp tại Sky First Network.'
  );

  // 5. Join Page specific states
  const [joinRolesHeading, setJoinRolesHeading] = useState(
    page.joinRolesHeading || 'Các Nhóm Đối Tượng Tham Gia Sky First Network'
  );
  const [joinRolesSubtitle, setJoinRolesSubtitle] = useState(
    page.joinRolesSubtitle || 'Lựa chọn hình thức đóng góp và đồng hành phù hợp với năng lực và mục tiêu cá nhân'
  );

  const [joinRole1Title, setJoinRole1Title] = useState(
    page.joinRole1Title || 'Tình Nguyện Viên Chiến Dịch (hoạt động tình nguyện)'
  );
  const [joinRole1Tag, setJoinRole1Tag] = useState(page.joinRole1Tag || 'TÌNH NGUYỆN VIÊN');
  const [joinRole1Description, setJoinRole1Description] = useState(
    page.joinRole1Description ||
      'Tham gia trực tiếp các chiến dịch xã hội, mùa hè xanh, tiếp sức mùa thi và các hoạt động cộng đồng vì sự phát triển của thanh thiếu niên.'
  );
  const [joinRole1Period, setJoinRole1Period] = useState(
    page.joinRole1Period || 'Linh hoạt theo từng chiến dịch'
  );
  const [joinRole1ButtonLabel, setJoinRole1ButtonLabel] = useState(
    page.joinRole1ButtonLabel || 'Đăng Ký Tình Nguyện Viên'
  );
  const [joinRole1ButtonUrl, setJoinRole1ButtonUrl] = useState(
    page.joinRole1ButtonUrl || '/contact'
  );
  const [joinRole1Highlight1, setJoinRole1Highlight1] = useState(
    page.joinRole1Highlight1 || 'Thông tin ghi nhận hoặc Giấy chứng nhận theo từng chương trình, nếu có'
  );
  const [joinRole1Highlight2, setJoinRole1Highlight2] = useState(
    page.joinRole1Highlight2 || 'Linh hoạt đăng ký theo từng sự kiện và quỹ thời gian cá nhân'
  );
  const [joinRole1Highlight3, setJoinRole1Highlight3] = useState(
    page.joinRole1Highlight3 || 'Được tập huấn kỹ năng điều phối, an toàn và sơ cấp cứu thực tế'
  );
  const [joinRole1Highlight4, setJoinRole1Highlight4] = useState(
    page.joinRole1Highlight4 || 'Môi trường năng động kết nối bạn bè khắp các trường Đại học/THPT'
  );

  const [joinRole2Title, setJoinRole2Title] = useState(
    page.joinRole2Title || 'Thành Viên Ban Chấp hành & Core Team'
  );
  const [joinRole2Tag, setJoinRole2Tag] = useState(page.joinRole2Tag || 'Core Team Sky First Network');
  const [joinRole2Description, setJoinRole2Description] = useState(
    page.joinRole2Description ||
      'Trực tiếp tham gia quản trị, xây dựng nội dung giáo dục (SFEC), truyền thông thương hiệu (hoạt động truyền thông), hoặc nghiên cứu chuyển đổi số (hoạt động nghiên cứu).'
  );
  const [joinRole2Period, setJoinRole2Period] = useState(
    page.joinRole2Period || 'Nhiệm kỳ cam kết 06 - 12 tháng'
  );
  const [joinRole2ButtonLabel, setJoinRole2ButtonLabel] = useState(
    page.joinRole2ButtonLabel || 'Ứng Tuyển Ban Chấp hành'
  );
  const [joinRole2ButtonUrl, setJoinRole2ButtonUrl] = useState(
    page.joinRole2ButtonUrl || '/contact'
  );
  const [joinRole2Highlight1, setJoinRole2Highlight1] = useState(
    page.joinRole2Highlight1 || 'Được rèn luyện tư duy lãnh đạo, quản trị dự án chuyên nghiệp'
  );
  const [joinRole2Highlight2, setJoinRole2Highlight2] = useState(
    page.joinRole2Highlight2 || 'Chứng nhận bổ nhiệm và thư giới thiệu từ Ban Chấp hành Sky First Network'
  );
  const [joinRole2Highlight3, setJoinRole2Highlight3] = useState(
    page.joinRole2Highlight3 || 'Đào tạo nội bộ chuyên sâu cùng các cố vấn và chuyên gia đầu ngành'
  );
  const [joinRole2Highlight4, setJoinRole2Highlight4] = useState(
    page.joinRole2Highlight4 || 'Cơ hội tham gia các hoạt động phù hợp theo phân công'
  );

  const [joinRole3Title, setJoinRole3Title] = useState(
    page.joinRole3Title || 'Tổ Chức Đối Tác & Bảo Trợ Đồng Hành'
  );
  const [joinRole3Tag, setJoinRole3Tag] = useState(page.joinRole3Tag || 'ĐỐI TÁC CHIẾN LƯỢC');
  const [joinRole3Description, setJoinRole3Description] = useState(
    page.joinRole3Description ||
      'Dành cho CLB/Đội/Nhóm, Đoàn Thanh niên, các trường THPT, Đại học và Doanh nghiệp mong muốn kết nối nguồn lực cùng phát triển cộng đồng.'
  );
  const [joinRole3Period, setJoinRole3Period] = useState(
    page.joinRole3Period || 'Theo chương trình / thỏa thuận phù hợp'
  );
  const [joinRole3ButtonLabel, setJoinRole3ButtonLabel] = useState(
    page.joinRole3ButtonLabel || 'Gửi Đề Xuất Hợp Tác'
  );
  const [joinRole3ButtonUrl, setJoinRole3ButtonUrl] = useState(
    page.joinRole3ButtonUrl || '/contact'
  );
  const [joinRole3Highlight1, setJoinRole3Highlight1] = useState(
    page.joinRole3Highlight1 || 'Đồng tổ chức các sự kiện giáo dục, hướng nghiệp quy mô lớn'
  );
  const [joinRole3Highlight2, setJoinRole3Highlight2] = useState(
    page.joinRole3Highlight2 || 'Bảo trợ kỹ thuật xác thực chứng nhận số miễn phí qua hệ thống hệ thống Giấy chứng nhận'
  );
  const [joinRole3Highlight3, setJoinRole3Highlight3] = useState(
    page.joinRole3Highlight3 || 'Tối ưu hóa nguồn lực truyền thông đa kênh tiếp cận học sinh - sinh viên'
  );
  const [joinRole3Highlight4, setJoinRole3Highlight4] = useState(
    page.joinRole3Highlight4 || 'Hỗ trợ kết nối chuyên gia, diễn giả và ban giám khảo chất lượng'
  );

  const [joinCtaHeading, setJoinCtaHeading] = useState(
    page.joinCtaHeading || 'Bạn Cần Trao Đổi Chi Tiết Về Cơ Hội Gia Nhập Hoặc Đề Xuất Dự Án?'
  );
  const [joinCtaDescription, setJoinCtaDescription] = useState(
    page.joinCtaDescription ||
      'Hệ thống tiếp nhận hồ sơ tập trung của Ban Nhân sự và Ban Đối ngoại & Sự kiện sẵn sàng hỗ trợ phản hồi trong vòng 24 giờ làm việc.'
  );
  const [joinCtaButtonLabel, setJoinCtaButtonLabel] = useState(
    page.joinCtaButtonLabel || 'Đến trang Liên hệ'
  );
  const [joinCtaButtonUrl, setJoinCtaButtonUrl] = useState(page.joinCtaButtonUrl || '/contact');
  const [joinHotline, setJoinHotline] = useState(page.joinHotline || '0337 775 329');
  const [joinHotlineTitle, setJoinHotlineTitle] = useState(page.joinHotlineTitle || 'Hotline Điều Phối');
  const [joinEmail, setJoinEmail] = useState(page.joinEmail || 'tuyendung@skyfirst.io.vn');
  const [joinEmailTitle, setJoinEmailTitle] = useState(page.joinEmailTitle || 'Email Tuyển Dụng & Nhân Sự');
  const [joinAddress, setJoinAddress] = useState(
    page.joinAddress || ''
  );
  const [joinAddressTitle, setJoinAddressTitle] = useState(page.joinAddressTitle || 'Văn Phòng Mạng Lưới');

  // Join FAQs states
  const [joinFaqHeading, setJoinFaqHeading] = useState(
    page.joinFaqHeading || 'Câu Hỏi Thường Gặp Về Tham gia Sky First Network'
  );
  const [joinFaqSubtitle, setJoinFaqSubtitle] = useState(
    page.joinFaqSubtitle || 'GIẢI ĐÁP THẮC MẮC ỨNG VIÊN & ĐỐI TÁC'
  );
  const [joinFaq1Q, setJoinFaq1Q] = useState(
    page.joinFaq1Q || 'Ai có thể đăng ký làm Tình nguyện viên của Sky First Network?'
  );
  const [joinFaq1A, setJoinFaq1A] = useState(
    page.joinFaq1A || 'Mọi bạn trẻ (học sinh THPT, sinh viên, cựu sinh viên và người đi làm) có tinh thần trách nhiệm, yêu thích hoạt động cộng đồng và mong muốn cống hiến đều có thể đăng ký tham gia các chiến dịch hoạt động tình nguyện.'
  );
  const [joinFaq2Q, setJoinFaq2Q] = useState(
    page.joinFaq2Q || 'Ứng tuyển vào Ban Chấp hành có yêu cầu kinh nghiệm trước không?'
  );
  const [joinFaq2A, setJoinFaq2A] = useState(
    page.joinFaq2A || 'Sky First Network đánh giá cao thái độ học hỏi, sự chủ động và tinh thần cam kết. Yêu cầu cụ thể được công bố theo từng vị trí hoặc đợt tuyển.'
  );
  const [joinFaq3Q, setJoinFaq3Q] = useState(
    page.joinFaq3Q || 'Giấy Giấy chứng nhận sau mỗi chiến dịch có giá trị như thế nào?'
  );
  const [joinFaq3A, setJoinFaq3A] = useState(
    page.joinFaq3A || 'Mỗi Giấy chứng nhận được ghi nhận trong hệ thống có mã phục vụ việc tra cứu và đối chiếu thông tin. Website không tự khẳng định giá trị sử dụng của Giấy chứng nhận đối với bên thứ ba.'
  );
  const [joinFaq4Q, setJoinFaq4Q] = useState(
    page.joinFaq4Q || 'Quy trình tiếp nhận và phản hồi hồ sơ đăng ký mất bao lâu?'
  );
  const [joinFaq4A, setJoinFaq4A] = useState(
    page.joinFaq4A || 'Sau khi bạn gửi thông tin qua form hoặc email, Ban Nhân sự sẽ gửi thư xác nhận tự động và liên hệ lại trong vòng 24 - 48 giờ làm việc để xếp lịch phỏng vấn/trao đổi trực tiếp.'
  );

  // 6. Contact Page specific states
  const [email, setEmail] = useState(page.email || 'skyfirst.ec@gmail.com');
  const [secondaryEmail, setSecondaryEmail] = useState(
    page.secondaryEmail || 'contact@skyfirst.network'
  );
  const [hotline, setHotline] = useState(page.hotline || '0337 775 329');
  const [secondaryHotline, setSecondaryHotline] = useState(
    page.secondaryHotline || '0912 838 xxx (Đối ngoại)'
  );
  const [workHoursWeekdays, setWorkHoursWeekdays] = useState(
    page.workHoursWeekdays || '08:30 - 18:00'
  );
  const [workHoursSaturday, setWorkHoursSaturday] = useState(
    page.workHoursSaturday || '08:30 - 12:00'
  );
  const [facebookUrl, setFacebookUrl] = useState(
    page.facebookUrl || 'https://facebook.com/skyfirstnetwork'
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    page.linkedinUrl || 'https://linkedin.com/company/skyfirstnetwork'
  );
  const [contactFormTitle, setContactFormTitle] = useState(
    page.contactFormTitle || 'Gửi Tin Nhắn Đến Ban Chấp hành'
  );
  const [contactFormDescription, setContactFormDescription] = useState(
    page.contactFormDescription ||
      'Vui lòng điền đầy đủ các thông tin bên dưới. Hệ thống sẽ điều phối thư đến đúng phòng ban và đơn vị liên quan.'
  );
  const [contactSubmitButtonLabel, setContactSubmitButtonLabel] = useState(
    page.contactSubmitButtonLabel || 'Gửi tin nhắn'
  );
  const [contactUnitsTitle, setContactUnitsTitle] = useState(
    page.contactUnitsTitle || 'Đầu Mối 5 Đơn Vị Trực Thuộc'
  );
  const [contactUnitsSubtitle, setContactUnitsSubtitle] = useState(
    page.contactUnitsSubtitle || 'Liên hệ chuyên biệt theo từng mảng chuyên môn của mạng lưới:'
  );
  const [contactFaqTitle, setContactFaqTitle] = useState(
    page.contactFaqTitle || 'Câu Hỏi Thường Gặp Về Liên Hệ'
  );
  const [contactFaq1Q, setContactFaq1Q] = useState(
    page.contactFaq1Q || 'Thời gian Ban Chấp hành Sky First Network tiếp nhận và phản hồi email là bao lâu?'
  );
  const [contactFaq1A, setContactFaq1A] = useState(
    page.contactFaq1A ||
      'Toàn bộ thư từ và yêu cầu kết nối qua hòm thư điện tử hoặc biểu mẫu trực tuyến đều được phân loại và phản hồi chính thức trong vòng 24 - 48 giờ làm việc.'
  );
  const [contactFaq2Q, setContactFaq2Q] = useState(
    page.contactFaq2Q || 'Tôi muốn đặt lịch làm việc trực tiếp tại Sky First Network thì cần làm gì?'
  );
  const [contactFaq2A, setContactFaq2A] = useState(
    page.contactFaq2A ||
      'Quý đối tác hoặc các bạn trẻ vui lòng gửi thông tin trước qua biểu mẫu bên dưới hoặc gọi tới hotline điều phối (0337 775 329) trước ít nhất 01 ngày làm việc để ban thư ký sắp xếp tiếp đón chu đáo.'
  );
  const [contactFaq3Q, setContactFaq3Q] = useState(
    page.contactFaq3Q || 'Làm thế nào để liên hệ trực tiếp với người phụ trách từng đơn vị trực thuộc?'
  );
  const [contactFaq3A, setContactFaq3A] = useState(
    page.contactFaq3A ||
      'Bạn có thể chọn trực tiếp đơn vị mong muốn (SFEC, hoạt động tình nguyện, hoạt động nghiên cứu, hoạt động truyền thông, hệ thống Giấy chứng nhận) tại mục "Đơn vị muốn kết nối" trong biểu mẫu liên hệ, thông tin sẽ được tự động gửi tới email nội bộ của trưởng đơn vị đó.'
  );
  const [contactFaq4Q, setContactFaq4Q] = useState(page.contactFaq4Q || '');
  const [contactFaq4A, setContactFaq4A] = useState(page.contactFaq4A || '');
  const [contactCtaTitle, setContactCtaTitle] = useState(
    page.contactCtaTitle || 'Bạn quan tâm đến các chương trình & dự án cụ thể?'
  );
  const [contactCtaDescription, setContactCtaDescription] = useState(
    page.contactCtaDescription ||
      'Khám phá danh sách các khóa học SFEC, chiến dịch tình nguyện và đề tài nghiên cứu đang mở đăng ký.'
  );

  // URL display logic matching website routing
  const getDisplayUrl = () => {
    if (page.slug === 'about') return '/about';
    if (page.slug === 'contact') return '/contact';
    if (['certificate', 'sponsor', 'join'].includes(page.slug)) {
      return `/${page.slug}`;
    }
    return `/trang/${slug || page.slug}`;
  };

  const handleSave = (publishState?: boolean) => {
    const finalPublishState = publishState !== undefined ? publishState : isPublished;

    if (!title.trim()) {
      onShowToast('Vui lòng nhập tiêu đề cho trang!');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title) || page.slug;

    onSave({
      title: title.trim(),
      slug: finalSlug,
      badge: badge.trim(),
      summary: summary.trim(),
      content: content.trim(),
      contentFormatted: content.trim(),
      imageUrl: imageUrl.trim(),
      secondaryImageUrl: secondaryImageUrl.trim(),
      author: author.trim() || 'Ban Quản trị Sky First Network',
      publishedAt: publishedAt || new Date().toLocaleDateString('vi-VN'),
      isPublished: finalPublishState,
      showInFooter: showInFooter,
      // General Button fields
      buttonLabel: buttonLabel.trim(),
      buttonUrl: buttonUrl.trim(),
      secondaryButtonLabel: secondaryButtonLabel.trim(),
      secondaryButtonUrl: secondaryButtonUrl.trim(),
      // About fields
      visionBadge: visionBadge.trim(),
      visionTitle: visionTitle.trim(),
      visionContent: visionContent.trim(),
      missionBadge: missionBadge.trim(),
      missionTitle: missionTitle.trim(),
      missionContent: missionContent.trim(),
      philosophyBadge: philosophyBadge.trim(),
      philosophyTitle: philosophyTitle.trim(),
      philosophyContent: philosophyContent.trim(),
      pillarsSectionTitle: pillarsSectionTitle.trim(),
      pillarsSectionBadge: pillarsSectionBadge.trim(),
      customPillars,
      valuesSectionTitle: valuesSectionTitle.trim(),
      customValues,
      timelineSectionTitle: timelineSectionTitle.trim(),
      timelineSectionBadge: timelineSectionBadge.trim(),
      customTimeline,
      teamSectionTitle: teamSectionTitle.trim(),
      teamSectionSubtitle: teamSectionSubtitle.trim(),
      customTeam,
      unitsSectionBadge: unitsSectionBadge.trim(),
      unitsSectionTitle: unitsSectionTitle.trim(),
      unitsButtonLabel: unitsButtonLabel.trim(),
      unitsButtonUrl: unitsButtonUrl.trim(),
      ctaTitle: ctaTitle.trim(),
      ctaDescription: ctaDescription.trim(),
      // Certificate fields
      certSearchLabel: certSearchLabel.trim(),
      certSearchPlaceholder: certSearchPlaceholder.trim(),
      certGuidanceNote: certGuidanceNote.trim(),
      certSearchButtonLabel: certSearchButtonLabel.trim(),
      certResetButtonLabel: certResetButtonLabel.trim(),
      certFeature1Title: certFeature1Title.trim(),
      certFeature1Desc: certFeature1Desc.trim(),
      certFeature2Title: certFeature2Title.trim(),
      certFeature2Desc: certFeature2Desc.trim(),
      certFeature3Title: certFeature3Title.trim(),
      certFeature3Desc: certFeature3Desc.trim(),
      certCtaTitle: certCtaTitle.trim(),
      certCtaDescription: certCtaDescription.trim(),
      certCtaButtonLabel: certCtaButtonLabel.trim(),
      certCtaButtonUrl: certCtaButtonUrl.trim(),
      // Sponsor fields
      sponsorHeroPrimaryButtonLabel: sponsorHeroPrimaryButtonLabel.trim(),
      sponsorHeroPrimaryButtonUrl: sponsorHeroPrimaryButtonUrl.trim(),
      sponsorHeroSecondaryButtonLabel: sponsorHeroSecondaryButtonLabel.trim(),
      sponsorHeroSecondaryButtonUrl: sponsorHeroSecondaryButtonUrl.trim(),
      sponsorCommitmentHeading: sponsorCommitmentHeading.trim(),
      sponsorCommitmentSubtitle: sponsorCommitmentSubtitle.trim(),
      sponsorCommit1Title: sponsorCommit1Title.trim(),
      sponsorCommit1Desc: sponsorCommit1Desc.trim(),
      sponsorCommit2Title: sponsorCommit2Title.trim(),
      sponsorCommit2Desc: sponsorCommit2Desc.trim(),
      sponsorCommit3Title: sponsorCommit3Title.trim(),
      sponsorCommit3Desc: sponsorCommit3Desc.trim(),
      sponsorCommit4Title: sponsorCommit4Title.trim(),
      sponsorCommit4Desc: sponsorCommit4Desc.trim(),
      sponsorPackagesHeading: sponsorPackagesHeading.trim(),
      sponsorPackagesSubtitle: sponsorPackagesSubtitle.trim(),
      sponsorPkg1Title: sponsorPkg1Title.trim(),
      sponsorPkg1Badge: sponsorPkg1Badge.trim(),
      sponsorPkg1Unit: sponsorPkg1Unit.trim(),
      sponsorPkg1Desc: sponsorPkg1Desc.trim(),
      sponsorPkg1Impact: sponsorPkg1Impact.trim(),
      sponsorPkg2Title: sponsorPkg2Title.trim(),
      sponsorPkg2Badge: sponsorPkg2Badge.trim(),
      sponsorPkg2Unit: sponsorPkg2Unit.trim(),
      sponsorPkg2Desc: sponsorPkg2Desc.trim(),
      sponsorPkg2Impact: sponsorPkg2Impact.trim(),
      sponsorPkg3Title: sponsorPkg3Title.trim(),
      sponsorPkg3Badge: sponsorPkg3Badge.trim(),
      sponsorPkg3Unit: sponsorPkg3Unit.trim(),
      sponsorPkg3Desc: sponsorPkg3Desc.trim(),
      sponsorPkg3Impact: sponsorPkg3Impact.trim(),
      sponsorPkg4Title: sponsorPkg4Title.trim(),
      sponsorPkg4Badge: sponsorPkg4Badge.trim(),
      sponsorPkg4Unit: sponsorPkg4Unit.trim(),
      sponsorPkg4Desc: sponsorPkg4Desc.trim(),
      sponsorPkg4Impact: sponsorPkg4Impact.trim(),
      sponsorBankName: sponsorBankName.trim(),
      sponsorBankAccount: sponsorBankAccount.trim(),
      sponsorAccountHolder: sponsorAccountHolder.trim(),
      sponsorBankBranch: sponsorBankBranch.trim(),
      sponsorTransferSyntax: sponsorTransferSyntax.trim(),
      sponsorQrCodeUrl: sponsorQrCodeUrl.trim(),
      sponsorQrCodeTitle: sponsorQrCodeTitle.trim(),
      sponsorQrCodeSubtitle: sponsorQrCodeSubtitle.trim(),
      sponsorCopyButtonLabel: sponsorCopyButtonLabel.trim(),
      sponsorHotline: sponsorHotline.trim(),
      sponsorEmail: sponsorEmail.trim(),
      sponsorContactLeadTitle: sponsorContactLeadTitle.trim(),
      sponsorContactHeading: sponsorContactHeading.trim(),
      sponsorContactDescription: sponsorContactDescription.trim(),
      sponsorContactButtonLabel: sponsorContactButtonLabel.trim(),
      sponsorContactButtonUrl: sponsorContactButtonUrl.trim(),
      sponsorUnitsButtonLabel: sponsorUnitsButtonLabel.trim(),
      sponsorUnitsButtonUrl: sponsorUnitsButtonUrl.trim(),
      sponsorContactHotline: sponsorContactHotline.trim(),
      sponsorContactEmail: sponsorContactEmail.trim(),
      sponsorFaqHeading: sponsorFaqHeading.trim(),
      sponsorFaqSubtitle: sponsorFaqSubtitle.trim(),
      sponsorFaq1Q: sponsorFaq1Q.trim(),
      sponsorFaq1A: sponsorFaq1A.trim(),
      sponsorFaq2Q: sponsorFaq2Q.trim(),
      sponsorFaq2A: sponsorFaq2A.trim(),
      sponsorFaq3Q: sponsorFaq3Q.trim(),
      sponsorFaq3A: sponsorFaq3A.trim(),
      sponsorFaq4Q: sponsorFaq4Q.trim(),
      sponsorFaq4A: sponsorFaq4A.trim(),
      sponsorCtaTitle: sponsorCtaTitle.trim(),
      sponsorCtaDescription: sponsorCtaDescription.trim(),
      // Join fields
      joinRolesHeading: joinRolesHeading.trim(),
      joinRolesSubtitle: joinRolesSubtitle.trim(),
      joinRole1Title: joinRole1Title.trim(),
      joinRole1Tag: joinRole1Tag.trim(),
      joinRole1Description: joinRole1Description.trim(),
      joinRole1Period: joinRole1Period.trim(),
      joinRole1ButtonLabel: joinRole1ButtonLabel.trim(),
      joinRole1ButtonUrl: joinRole1ButtonUrl.trim(),
      joinRole1Highlight1: joinRole1Highlight1.trim(),
      joinRole1Highlight2: joinRole1Highlight2.trim(),
      joinRole1Highlight3: joinRole1Highlight3.trim(),
      joinRole1Highlight4: joinRole1Highlight4.trim(),
      joinRole2Title: joinRole2Title.trim(),
      joinRole2Tag: joinRole2Tag.trim(),
      joinRole2Description: joinRole2Description.trim(),
      joinRole2Period: joinRole2Period.trim(),
      joinRole2ButtonLabel: joinRole2ButtonLabel.trim(),
      joinRole2ButtonUrl: joinRole2ButtonUrl.trim(),
      joinRole2Highlight1: joinRole2Highlight1.trim(),
      joinRole2Highlight2: joinRole2Highlight2.trim(),
      joinRole2Highlight3: joinRole2Highlight3.trim(),
      joinRole2Highlight4: joinRole2Highlight4.trim(),
      joinRole3Title: joinRole3Title.trim(),
      joinRole3Tag: joinRole3Tag.trim(),
      joinRole3Description: joinRole3Description.trim(),
      joinRole3Period: joinRole3Period.trim(),
      joinRole3ButtonLabel: joinRole3ButtonLabel.trim(),
      joinRole3ButtonUrl: joinRole3ButtonUrl.trim(),
      joinRole3Highlight1: joinRole3Highlight1.trim(),
      joinRole3Highlight2: joinRole3Highlight2.trim(),
      joinRole3Highlight3: joinRole3Highlight3.trim(),
      joinRole3Highlight4: joinRole3Highlight4.trim(),
      joinCtaHeading: joinCtaHeading.trim(),
      joinCtaDescription: joinCtaDescription.trim(),
      joinCtaButtonLabel: joinCtaButtonLabel.trim(),
      joinCtaButtonUrl: joinCtaButtonUrl.trim(),
      joinHotline: joinHotline.trim(),
      joinHotlineTitle: joinHotlineTitle.trim(),
      joinEmail: joinEmail.trim(),
      joinEmailTitle: joinEmailTitle.trim(),
      joinAddress: joinAddress.trim(),
      joinAddressTitle: joinAddressTitle.trim(),
      joinFaqHeading: joinFaqHeading.trim(),
      joinFaqSubtitle: joinFaqSubtitle.trim(),
      joinFaq1Q: joinFaq1Q.trim(),
      joinFaq1A: joinFaq1A.trim(),
      joinFaq2Q: joinFaq2Q.trim(),
      joinFaq2A: joinFaq2A.trim(),
      joinFaq3Q: joinFaq3Q.trim(),
      joinFaq3A: joinFaq3A.trim(),
      joinFaq4Q: joinFaq4Q.trim(),
      joinFaq4A: joinFaq4A.trim(),
      // Contact fields
      email: email.trim(),
      secondaryEmail: secondaryEmail.trim(),
      hotline: hotline.trim(),
      secondaryHotline: secondaryHotline.trim(),
      workHoursWeekdays: workHoursWeekdays.trim(),
      workHoursSaturday: workHoursSaturday.trim(),
      facebookUrl: facebookUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      contactFormTitle: contactFormTitle.trim(),
      contactFormDescription: contactFormDescription.trim(),
      contactSubmitButtonLabel: contactSubmitButtonLabel.trim(),
      contactUnitsTitle: contactUnitsTitle.trim(),
      contactUnitsSubtitle: contactUnitsSubtitle.trim(),
      contactFaqTitle: contactFaqTitle.trim(),
      contactFaq1Q: contactFaq1Q.trim(),
      contactFaq1A: contactFaq1A.trim(),
      contactFaq2Q: contactFaq2Q.trim(),
      contactFaq2A: contactFaq2A.trim(),
      contactFaq3Q: contactFaq3Q.trim(),
      contactFaq3A: contactFaq3A.trim(),
      contactFaq4Q: contactFaq4Q.trim(),
      contactFaq4A: contactFaq4A.trim(),
      contactCtaTitle: contactCtaTitle.trim(),
      contactCtaDescription: contactCtaDescription.trim(),
    });

    setIsPublished(finalPublishState);

    if (finalPublishState) {
      onShowToast(`Đã lưu và xuất bản trang "${title.trim()}" thành công lên website chính!`);
    } else {
      onShowToast(`Đã lưu các chỉnh sửa của trang "${title.trim()}" (Bản nháp)!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* 1. Thanh Tiêu Đề Độc Lập (Header) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="editor-btn-back"
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-2 text-xs font-bold"
            title="Quay lại danh sách trang"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Quay lại danh sách</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {isPublished ? (
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

            <span className="text-xs text-sky-700 font-mono bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 font-bold hidden sm:inline">
              {getDisplayUrl()}
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isPublished ? (
            <>
              {/* Trang đang ở trạng thái Bản nháp: Cần ấn lưu để lưu các chỉnh sửa, và ấn đăng bài thì bài mới được xuất bản */}
              <button
                type="button"
                id="editor-btn-save-draft"
                onClick={() => handleSave(false)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Lưu lại các chỉnh sửa (giữ ở trạng thái Bản nháp)"
              >
                <Save size={15} className="text-[#0284C7]" />
                <span>LƯU CHỈNH SỬA</span>
              </button>

              <button
                type="button"
                id="editor-btn-publish"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Xuất bản trang để hiển thị chính thức trên website"
              >
                <CheckCircle2 size={15} />
                <span>ĐĂNG BÀI</span>
              </button>
            </>
          ) : (
            <>
              {/* Trang đã xuất bản: Có thể chuyển về Bản nháp hoặc Lưu các thay đổi lên trang chính */}
              <button
                type="button"
                id="editor-btn-unpublish"
                onClick={() => handleSave(false)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                title="Chuyển trang về trạng thái Bản nháp (gỡ khỏi website chính)"
              >
                <Clock size={14} className="text-amber-600" />
                <span>Chuyển về Nháp</span>
              </button>

              <button
                type="button"
                id="editor-btn-save"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Lưu các thay đổi và áp dụng trực tiếp lên website chính"
              >
                <Save size={15} />
                <span>LƯU TRANG</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. Thân Soạn Thảo (Main Editor) */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 flex-1">
        {/* KHỐI 0: CÀI ĐẶT ĐƯỜNG DẪN & XUẤT BẢN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Thông tin xuất bản & Đường dẫn trang
            </h2>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showInFooter}
                onChange={(e) => setShowInFooter(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Hiển thị liên kết tại Chân trang (Footer)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5">
                <LinkIcon size={14} className="text-[#0284C7]" />
                Đường dẫn tĩnh (Slug)
              </label>
              <input
                type="text"
                id="editor-input-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="vi-du-duong-dan"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5">
                <User size={14} className="text-[#0284C7]" />
                Người xuất bản
              </label>
              <input
                type="text"
                id="editor-input-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ban Quản trị Sky First Network"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1.5">
                <Calendar size={14} className="text-[#0284C7]" />
                Ngày xuất bản
              </label>
              <input
                type="text"
                id="editor-input-publishedAt"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                placeholder="01/01/2026"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* RENDER CÁC TRƯỜNG ĐẶC THÙ THEO ĐÚNG CẤU TRÚC TỪNG TRANG */}
        {isAboutPage && (
          <AboutEditorFields
            badge={badge}
            setBadge={setBadge}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            visionBadge={visionBadge}
            setVisionBadge={setVisionBadge}
            visionTitle={visionTitle}
            setVisionTitle={setVisionTitle}
            visionContent={visionContent}
            setVisionContent={setVisionContent}
            missionBadge={missionBadge}
            setMissionBadge={setMissionBadge}
            missionTitle={missionTitle}
            setMissionTitle={setMissionTitle}
            missionContent={missionContent}
            setMissionContent={setMissionContent}
            philosophyBadge={philosophyBadge}
            setPhilosophyBadge={setPhilosophyBadge}
            philosophyTitle={philosophyTitle}
            setPhilosophyTitle={setPhilosophyTitle}
            philosophyContent={philosophyContent}
            setPhilosophyContent={setPhilosophyContent}
            pillarsSectionTitle={pillarsSectionTitle}
            setPillarsSectionTitle={setPillarsSectionTitle}
            pillarsSectionBadge={pillarsSectionBadge}
            setPillarsSectionBadge={setPillarsSectionBadge}
            customPillars={customPillars}
            setCustomPillars={setCustomPillars}
            valuesSectionTitle={valuesSectionTitle}
            setValuesSectionTitle={setValuesSectionTitle}
            customValues={customValues}
            setCustomValues={setCustomValues}
            timelineSectionTitle={timelineSectionTitle}
            setTimelineSectionTitle={setTimelineSectionTitle}
            timelineSectionBadge={timelineSectionBadge}
            setTimelineSectionBadge={setTimelineSectionBadge}
            customTimeline={customTimeline}
            setCustomTimeline={setCustomTimeline}
            teamSectionTitle={teamSectionTitle}
            setTeamSectionTitle={setTeamSectionTitle}
            teamSectionSubtitle={teamSectionSubtitle}
            setTeamSectionSubtitle={setTeamSectionSubtitle}
            customTeam={customTeam}
            setCustomTeam={setCustomTeam}
            unitsSectionBadge={unitsSectionBadge}
            setUnitsSectionBadge={setUnitsSectionBadge}
            unitsSectionTitle={unitsSectionTitle}
            setUnitsSectionTitle={setUnitsSectionTitle}
            unitsButtonLabel={unitsButtonLabel}
            setUnitsButtonLabel={setUnitsButtonLabel}
            unitsButtonUrl={unitsButtonUrl}
            setUnitsButtonUrl={setUnitsButtonUrl}
            ctaTitle={ctaTitle}
            setCtaTitle={setCtaTitle}
            ctaDescription={ctaDescription}
            setCtaDescription={setCtaDescription}
            buttonLabel={buttonLabel}
            setButtonLabel={setButtonLabel}
            buttonUrl={buttonUrl}
            setButtonUrl={setButtonUrl}
            secondaryButtonLabel={secondaryButtonLabel}
            setSecondaryButtonLabel={setSecondaryButtonLabel}
            secondaryButtonUrl={secondaryButtonUrl}
            setSecondaryButtonUrl={setSecondaryButtonUrl}
          />
        )}

        {isCertificatePage && (
          <CertificateEditorFields
            badge={badge}
            setBadge={setBadge}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            certSearchLabel={certSearchLabel}
            setCertSearchLabel={setCertSearchLabel}
            certSearchPlaceholder={certSearchPlaceholder}
            setCertSearchPlaceholder={setCertSearchPlaceholder}
            certGuidanceNote={certGuidanceNote}
            setCertGuidanceNote={setCertGuidanceNote}
            certSearchButtonLabel={certSearchButtonLabel}
            setCertSearchButtonLabel={setCertSearchButtonLabel}
            certResetButtonLabel={certResetButtonLabel}
            setCertResetButtonLabel={setCertResetButtonLabel}
            certFeature1Title={certFeature1Title}
            setCertFeature1Title={setCertFeature1Title}
            certFeature1Desc={certFeature1Desc}
            setCertFeature1Desc={setCertFeature1Desc}
            certFeature2Title={certFeature2Title}
            setCertFeature2Title={setCertFeature2Title}
            certFeature2Desc={certFeature2Desc}
            setCertFeature2Desc={setCertFeature2Desc}
            certFeature3Title={certFeature3Title}
            setCertFeature3Title={setCertFeature3Title}
            certFeature3Desc={certFeature3Desc}
            setCertFeature3Desc={setCertFeature3Desc}
            certCtaTitle={certCtaTitle}
            setCertCtaTitle={setCertCtaTitle}
            certCtaDescription={certCtaDescription}
            setCertCtaDescription={setCertCtaDescription}
            certCtaButtonLabel={certCtaButtonLabel}
            setCertCtaButtonLabel={setCertCtaButtonLabel}
            certCtaButtonUrl={certCtaButtonUrl}
            setCertCtaButtonUrl={setCertCtaButtonUrl}
            contentFormatted={content}
            setContentFormatted={setContent}
          />
        )}

        {isSponsorPage && (
          <SponsorEditorFields
            badge={badge}
            setBadge={setBadge}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            sponsorHeroPrimaryButtonLabel={sponsorHeroPrimaryButtonLabel}
            setSponsorHeroPrimaryButtonLabel={setSponsorHeroPrimaryButtonLabel}
            sponsorHeroPrimaryButtonUrl={sponsorHeroPrimaryButtonUrl}
            setSponsorHeroPrimaryButtonUrl={setSponsorHeroPrimaryButtonUrl}
            sponsorHeroSecondaryButtonLabel={sponsorHeroSecondaryButtonLabel}
            setSponsorHeroSecondaryButtonLabel={setSponsorHeroSecondaryButtonLabel}
            sponsorHeroSecondaryButtonUrl={sponsorHeroSecondaryButtonUrl}
            setSponsorHeroSecondaryButtonUrl={setSponsorHeroSecondaryButtonUrl}
            // Commitments
            sponsorCommitmentHeading={sponsorCommitmentHeading}
            setSponsorCommitmentHeading={setSponsorCommitmentHeading}
            sponsorCommitmentSubtitle={sponsorCommitmentSubtitle}
            setSponsorCommitmentSubtitle={setSponsorCommitmentSubtitle}
            sponsorCommit1Title={sponsorCommit1Title}
            setSponsorCommit1Title={setSponsorCommit1Title}
            sponsorCommit1Desc={sponsorCommit1Desc}
            setSponsorCommit1Desc={setSponsorCommit1Desc}
            sponsorCommit2Title={sponsorCommit2Title}
            setSponsorCommit2Title={setSponsorCommit2Title}
            sponsorCommit2Desc={sponsorCommit2Desc}
            setSponsorCommit2Desc={setSponsorCommit2Desc}
            sponsorCommit3Title={sponsorCommit3Title}
            setSponsorCommit3Title={setSponsorCommit3Title}
            sponsorCommit3Desc={sponsorCommit3Desc}
            setSponsorCommit3Desc={setSponsorCommit3Desc}
            sponsorCommit4Title={sponsorCommit4Title}
            setSponsorCommit4Title={setSponsorCommit4Title}
            sponsorCommit4Desc={sponsorCommit4Desc}
            setSponsorCommit4Desc={setSponsorCommit4Desc}
            // Packages
            sponsorPackagesHeading={sponsorPackagesHeading}
            setSponsorPackagesHeading={setSponsorPackagesHeading}
            sponsorPackagesSubtitle={sponsorPackagesSubtitle}
            setSponsorPackagesSubtitle={setSponsorPackagesSubtitle}
            sponsorPkg1Title={sponsorPkg1Title}
            setSponsorPkg1Title={setSponsorPkg1Title}
            sponsorPkg1Badge={sponsorPkg1Badge}
            setSponsorPkg1Badge={setSponsorPkg1Badge}
            sponsorPkg1Unit={sponsorPkg1Unit}
            setSponsorPkg1Unit={setSponsorPkg1Unit}
            sponsorPkg1Desc={sponsorPkg1Desc}
            setSponsorPkg1Desc={setSponsorPkg1Desc}
            sponsorPkg1Impact={sponsorPkg1Impact}
            setSponsorPkg1Impact={setSponsorPkg1Impact}
            sponsorPkg2Title={sponsorPkg2Title}
            setSponsorPkg2Title={setSponsorPkg2Title}
            sponsorPkg2Badge={sponsorPkg2Badge}
            setSponsorPkg2Badge={setSponsorPkg2Badge}
            sponsorPkg2Unit={sponsorPkg2Unit}
            setSponsorPkg2Unit={setSponsorPkg2Unit}
            sponsorPkg2Desc={sponsorPkg2Desc}
            setSponsorPkg2Desc={setSponsorPkg2Desc}
            sponsorPkg2Impact={sponsorPkg2Impact}
            setSponsorPkg2Impact={setSponsorPkg2Impact}
            sponsorPkg3Title={sponsorPkg3Title}
            setSponsorPkg3Title={setSponsorPkg3Title}
            sponsorPkg3Badge={sponsorPkg3Badge}
            setSponsorPkg3Badge={setSponsorPkg3Badge}
            sponsorPkg3Unit={sponsorPkg3Unit}
            setSponsorPkg3Unit={setSponsorPkg3Unit}
            sponsorPkg3Desc={sponsorPkg3Desc}
            setSponsorPkg3Desc={setSponsorPkg3Desc}
            sponsorPkg3Impact={sponsorPkg3Impact}
            setSponsorPkg3Impact={setSponsorPkg3Impact}
            sponsorPkg4Title={sponsorPkg4Title}
            setSponsorPkg4Title={setSponsorPkg4Title}
            sponsorPkg4Badge={sponsorPkg4Badge}
            setSponsorPkg4Badge={setSponsorPkg4Badge}
            sponsorPkg4Unit={sponsorPkg4Unit}
            setSponsorPkg4Unit={setSponsorPkg4Unit}
            sponsorPkg4Desc={sponsorPkg4Desc}
            setSponsorPkg4Desc={setSponsorPkg4Desc}
            sponsorPkg4Impact={sponsorPkg4Impact}
            setSponsorPkg4Impact={setSponsorPkg4Impact}
            // Bank details
            sponsorBankName={sponsorBankName}
            setSponsorBankName={setSponsorBankName}
            sponsorBankBranch={sponsorBankBranch}
            setSponsorBankBranch={setSponsorBankBranch}
            sponsorBankAccount={sponsorBankAccount}
            setSponsorBankAccount={setSponsorBankAccount}
            sponsorAccountHolder={sponsorAccountHolder}
            setSponsorAccountHolder={setSponsorAccountHolder}
            sponsorTransferSyntax={sponsorTransferSyntax}
            setSponsorTransferSyntax={setSponsorTransferSyntax}
            sponsorQrCodeUrl={sponsorQrCodeUrl}
            setSponsorQrCodeUrl={setSponsorQrCodeUrl}
            sponsorQrCodeTitle={sponsorQrCodeTitle}
            setSponsorQrCodeTitle={setSponsorQrCodeTitle}
            sponsorQrCodeSubtitle={sponsorQrCodeSubtitle}
            setSponsorQrCodeSubtitle={setSponsorQrCodeSubtitle}
            sponsorCopyButtonLabel={sponsorCopyButtonLabel}
            setSponsorCopyButtonLabel={setSponsorCopyButtonLabel}
            sponsorHotline={sponsorHotline}
            setSponsorHotline={setSponsorHotline}
            sponsorEmail={sponsorEmail}
            setSponsorEmail={setSponsorEmail}
            sponsorContactLeadTitle={sponsorContactLeadTitle}
            setSponsorContactLeadTitle={setSponsorContactLeadTitle}
            // Contact
            sponsorContactHeading={sponsorContactHeading}
            setSponsorContactHeading={setSponsorContactHeading}
            sponsorContactDescription={sponsorContactDescription}
            setSponsorContactDescription={setSponsorContactDescription}
            sponsorContactButtonLabel={sponsorContactButtonLabel}
            setSponsorContactButtonLabel={setSponsorContactButtonLabel}
            sponsorContactButtonUrl={sponsorContactButtonUrl}
            setSponsorContactButtonUrl={setSponsorContactButtonUrl}
            sponsorUnitsButtonLabel={sponsorUnitsButtonLabel}
            setSponsorUnitsButtonLabel={setSponsorUnitsButtonLabel}
            sponsorUnitsButtonUrl={sponsorUnitsButtonUrl}
            setSponsorUnitsButtonUrl={setSponsorUnitsButtonUrl}
            sponsorContactHotline={sponsorContactHotline}
            setSponsorContactHotline={setSponsorContactHotline}
            sponsorContactEmail={sponsorContactEmail}
            setSponsorContactEmail={setSponsorContactEmail}
            // FAQs
            sponsorFaqHeading={sponsorFaqHeading}
            setSponsorFaqHeading={setSponsorFaqHeading}
            sponsorFaqSubtitle={sponsorFaqSubtitle}
            setSponsorFaqSubtitle={setSponsorFaqSubtitle}
            sponsorFaq1Q={sponsorFaq1Q}
            setSponsorFaq1Q={setSponsorFaq1Q}
            sponsorFaq1A={sponsorFaq1A}
            setSponsorFaq1A={setSponsorFaq1A}
            sponsorFaq2Q={sponsorFaq2Q}
            setSponsorFaq2Q={setSponsorFaq2Q}
            sponsorFaq2A={sponsorFaq2A}
            setSponsorFaq2A={setSponsorFaq2A}
            sponsorFaq3Q={sponsorFaq3Q}
            setSponsorFaq3Q={setSponsorFaq3Q}
            sponsorFaq3A={sponsorFaq3A}
            setSponsorFaq3A={setSponsorFaq3A}
            sponsorFaq4Q={sponsorFaq4Q}
            setSponsorFaq4Q={setSponsorFaq4Q}
            sponsorFaq4A={sponsorFaq4A}
            setSponsorFaq4A={setSponsorFaq4A}
            // Quick CTA
            sponsorCtaTitle={sponsorCtaTitle}
            setSponsorCtaTitle={setSponsorCtaTitle}
            sponsorCtaDescription={sponsorCtaDescription}
            setSponsorCtaDescription={setSponsorCtaDescription}
            buttonLabel={buttonLabel}
            setButtonLabel={setButtonLabel}
            buttonUrl={buttonUrl}
            setButtonUrl={setButtonUrl}
            secondaryButtonLabel={secondaryButtonLabel}
            setSecondaryButtonLabel={setSecondaryButtonLabel}
            secondaryButtonUrl={secondaryButtonUrl}
            setSecondaryButtonUrl={setSecondaryButtonUrl}
            // Rich text content
            contentFormatted={content}
            setContentFormatted={setContent}
          />
        )}

        {isJoinPage && (
          <JoinEditorFields
            badge={badge}
            setBadge={setBadge}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            joinRolesHeading={joinRolesHeading}
            setJoinRolesHeading={setJoinRolesHeading}
            joinRolesSubtitle={joinRolesSubtitle}
            setJoinRolesSubtitle={setJoinRolesSubtitle}
            joinRole1Title={joinRole1Title}
            setJoinRole1Title={setJoinRole1Title}
            joinRole1Tag={joinRole1Tag}
            setJoinRole1Tag={setJoinRole1Tag}
            joinRole1Description={joinRole1Description}
            setJoinRole1Description={setJoinRole1Description}
            joinRole1Period={joinRole1Period}
            setJoinRole1Period={setJoinRole1Period}
            joinRole1ButtonLabel={joinRole1ButtonLabel}
            setJoinRole1ButtonLabel={setJoinRole1ButtonLabel}
            joinRole1ButtonUrl={joinRole1ButtonUrl}
            setJoinRole1ButtonUrl={setJoinRole1ButtonUrl}
            joinRole1Highlight1={joinRole1Highlight1}
            setJoinRole1Highlight1={setJoinRole1Highlight1}
            joinRole1Highlight2={joinRole1Highlight2}
            setJoinRole1Highlight2={setJoinRole1Highlight2}
            joinRole1Highlight3={joinRole1Highlight3}
            setJoinRole1Highlight3={setJoinRole1Highlight3}
            joinRole1Highlight4={joinRole1Highlight4}
            setJoinRole1Highlight4={setJoinRole1Highlight4}
            joinRole2Title={joinRole2Title}
            setJoinRole2Title={setJoinRole2Title}
            joinRole2Tag={joinRole2Tag}
            setJoinRole2Tag={setJoinRole2Tag}
            joinRole2Description={joinRole2Description}
            setJoinRole2Description={setJoinRole2Description}
            joinRole2Period={joinRole2Period}
            setJoinRole2Period={setJoinRole2Period}
            joinRole2ButtonLabel={joinRole2ButtonLabel}
            setJoinRole2ButtonLabel={setJoinRole2ButtonLabel}
            joinRole2ButtonUrl={joinRole2ButtonUrl}
            setJoinRole2ButtonUrl={setJoinRole2ButtonUrl}
            joinRole2Highlight1={joinRole2Highlight1}
            setJoinRole2Highlight1={setJoinRole2Highlight1}
            joinRole2Highlight2={joinRole2Highlight2}
            setJoinRole2Highlight2={setJoinRole2Highlight2}
            joinRole2Highlight3={joinRole2Highlight3}
            setJoinRole2Highlight3={setJoinRole2Highlight3}
            joinRole2Highlight4={joinRole2Highlight4}
            setJoinRole2Highlight4={setJoinRole2Highlight4}
            joinRole3Title={joinRole3Title}
            setJoinRole3Title={setJoinRole3Title}
            joinRole3Tag={joinRole3Tag}
            setJoinRole3Tag={setJoinRole3Tag}
            joinRole3Description={joinRole3Description}
            setJoinRole3Description={setJoinRole3Description}
            joinRole3Period={joinRole3Period}
            setJoinRole3Period={setJoinRole3Period}
            joinRole3ButtonLabel={joinRole3ButtonLabel}
            setJoinRole3ButtonLabel={setJoinRole3ButtonLabel}
            joinRole3ButtonUrl={joinRole3ButtonUrl}
            setJoinRole3ButtonUrl={setJoinRole3ButtonUrl}
            joinRole3Highlight1={joinRole3Highlight1}
            setJoinRole3Highlight1={setJoinRole3Highlight1}
            joinRole3Highlight2={joinRole3Highlight2}
            setJoinRole3Highlight2={setJoinRole3Highlight2}
            joinRole3Highlight3={joinRole3Highlight3}
            setJoinRole3Highlight3={setJoinRole3Highlight3}
            joinRole3Highlight4={joinRole3Highlight4}
            setJoinRole3Highlight4={setJoinRole3Highlight4}
            joinCtaHeading={joinCtaHeading}
            setJoinCtaHeading={setJoinCtaHeading}
            joinCtaDescription={joinCtaDescription}
            setJoinCtaDescription={setJoinCtaDescription}
            joinCtaButtonLabel={joinCtaButtonLabel}
            setJoinCtaButtonLabel={setJoinCtaButtonLabel}
            joinCtaButtonUrl={joinCtaButtonUrl}
            setJoinCtaButtonUrl={setJoinCtaButtonUrl}
            joinEmail={joinEmail}
            setJoinEmail={setJoinEmail}
            joinEmailTitle={joinEmailTitle}
            setJoinEmailTitle={setJoinEmailTitle}
            joinHotline={joinHotline}
            setJoinHotline={setJoinHotline}
            joinHotlineTitle={joinHotlineTitle}
            setJoinHotlineTitle={setJoinHotlineTitle}
            joinAddress={joinAddress}
            setJoinAddress={setJoinAddress}
            joinAddressTitle={joinAddressTitle}
            setJoinAddressTitle={setJoinAddressTitle}
            contentFormatted={content}
            setContentFormatted={setContent}
          />
        )}

        {isContactPage && (
          <ContactEditorFields
            badge={badge}
            setBadge={setBadge}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            email={email}
            setEmail={setEmail}
            secondaryEmail={secondaryEmail}
            setSecondaryEmail={setSecondaryEmail}
            hotline={hotline}
            setHotline={setHotline}
            secondaryHotline={secondaryHotline}
            setSecondaryHotline={setSecondaryHotline}
            workHoursWeekdays={workHoursWeekdays}
            setWorkHoursWeekdays={setWorkHoursWeekdays}
            workHoursSaturday={workHoursSaturday}
            setWorkHoursSaturday={setWorkHoursSaturday}
            facebookUrl={facebookUrl}
            setFacebookUrl={setFacebookUrl}
            linkedinUrl={linkedinUrl}
            setLinkedinUrl={setLinkedinUrl}
            contactFormTitle={contactFormTitle}
            setContactFormTitle={setContactFormTitle}
            contactFormDescription={contactFormDescription}
            setContactFormDescription={setContactFormDescription}
            contactSubmitButtonLabel={contactSubmitButtonLabel}
            setContactSubmitButtonLabel={setContactSubmitButtonLabel}
            contactUnitsTitle={contactUnitsTitle}
            setContactUnitsTitle={setContactUnitsTitle}
            contactUnitsSubtitle={contactUnitsSubtitle}
            setContactUnitsSubtitle={setContactUnitsSubtitle}
            contactFaqTitle={contactFaqTitle}
            setContactFaqTitle={setContactFaqTitle}
            contactFaq1Q={contactFaq1Q}
            setContactFaq1Q={setContactFaq1Q}
            contactFaq1A={contactFaq1A}
            setContactFaq1A={setContactFaq1A}
            contactFaq2Q={contactFaq2Q}
            setContactFaq2Q={setContactFaq2Q}
            contactFaq2A={contactFaq2A}
            setContactFaq2A={setContactFaq2A}
            contactFaq3Q={contactFaq3Q}
            setContactFaq3Q={setContactFaq3Q}
            contactFaq3A={contactFaq3A}
            setContactFaq3A={setContactFaq3A}
            contactFaq4Q={contactFaq4Q}
            setContactFaq4Q={setContactFaq4Q}
            contactFaq4A={contactFaq4A}
            setContactFaq4A={setContactFaq4A}
            contactCtaTitle={contactCtaTitle}
            setContactCtaTitle={setContactCtaTitle}
            contactCtaDescription={contactCtaDescription}
            setContactCtaDescription={setContactCtaDescription}
            buttonLabel={buttonLabel}
            setButtonLabel={setButtonLabel}
            buttonUrl={buttonUrl}
            setButtonUrl={setButtonUrl}
            secondaryButtonLabel={secondaryButtonLabel}
            setSecondaryButtonLabel={setSecondaryButtonLabel}
            secondaryButtonUrl={secondaryButtonUrl}
            setSecondaryButtonUrl={setSecondaryButtonUrl}
          />
        )}

        {!isAboutPage && !isCertificatePage && !isSponsorPage && !isJoinPage && !isContactPage && (
          <StandardEditorFields
            badge={badge}
            setBadge={setBadge}
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            contentFormatted={content}
            setContentFormatted={setContent}
            secondaryImageUrl={secondaryImageUrl}
            setSecondaryImageUrl={setSecondaryImageUrl}
            buttonLabel={buttonLabel}
            setButtonLabel={setButtonLabel}
            buttonUrl={buttonUrl}
            setButtonUrl={setButtonUrl}
            secondaryButtonLabel={secondaryButtonLabel}
            setSecondaryButtonLabel={setSecondaryButtonLabel}
            secondaryButtonUrl={secondaryButtonUrl}
            setSecondaryButtonUrl={setSecondaryButtonUrl}
          />
        )}
      </main>
    </div>
  );
};
