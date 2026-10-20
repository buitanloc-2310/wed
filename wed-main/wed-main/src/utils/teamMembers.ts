import type { TeamMember, TeamRoleSetting } from '../types';

export type TeamSortMode = 'rank' | 'manual';
export type IndexedTeamMember = { member: TeamMember; originalIndex: number };
export type TeamRoleSettingsMap = Record<string, TeamRoleSetting> | undefined;

export function normalizeTeamRole(role?: string): string {
  return String(role || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi-VN');
}

/** Resolves a stable, shared colour for each role across the whole team list. */
export function getTeamRoleColors(members: TeamMember[], settings?: TeamRoleSettingsMap): Map<string, string> {
  const canonical = new Map<string, string>();
  Object.entries(settings || {}).forEach(([key, setting]) => {
    if (setting?.color) canonical.set(normalizeTeamRole(key), setting.color);
  });
  const counts = new Map<string, Map<string, number>>();
  members.forEach((member) => {
    const key = normalizeTeamRole(member.role);
    if (!key || !member.roleColor || canonical.has(key)) return;
    const roleColors = counts.get(key) || new Map<string, number>();
    roleColors.set(member.roleColor, (roleColors.get(member.roleColor) || 0) + 1);
    counts.set(key, roleColors);
  });
  counts.forEach((roleColors, role) => {
    const selected = [...roleColors.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    if (selected && !canonical.has(role)) canonical.set(role, selected[0]);
  });
  return canonical;
}

/**
 * Default display priority is only a presentation rule, not an official hierarchy.
 * Admins can override it per member with roleRank, or switch the team list to manual order.
 * Lower numbers appear first.
 */
export function inferTeamRoleRank(role?: string): number {
  const value = String(role || '')
    .normalize('NFKC')
    .toLocaleLowerCase('vi-VN')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  if (/phó chủ tịch|phó tổng thư ký|phó tổng giám đốc/.test(value)) return 2;
  if (/nhà sáng lập|chủ tịch|tổng thư ký|tổng giám đốc/.test(value)) return 1;
  if (/phó chánh văn phòng|phó giám đốc văn phòng/.test(value)) return 4;
  if (/chánh văn phòng|giám đốc văn phòng/.test(value)) return 3;
  if (/phó trưởng ban|phó trưởng đơn vị|phó trưởng bộ phận|phó trưởng phòng|phó giám đốc/.test(value)) return 6;
  if (/trưởng ban|trưởng đơn vị|trưởng bộ phận|trưởng phòng|giám đốc/.test(value)) return 5;
  if (/thư ký|điều phối viên|điều phối/.test(value)) return 7;
  if (/thành viên|tình nguyện viên|cộng tác viên/.test(value)) return 8;
  return 9;
}

export function getTeamRoleRank(member: Pick<TeamMember, 'role' | 'roleRank'>, settings?: TeamRoleSettingsMap): number {
  const configuredRank = Number(settings?.[normalizeTeamRole(member.role)]?.rank);
  if (Number.isFinite(configuredRank) && configuredRank >= 1 && configuredRank <= 99) return configuredRank;
  const rank = Number(member.roleRank);
  return Number.isFinite(rank) && rank >= 1 && rank <= 99
    ? rank
    : inferTeamRoleRank(member.role);
}

export function sortTeamMemberEntries(
  entries: IndexedTeamMember[],
  mode: TeamSortMode = 'rank',
  roleSettings?: TeamRoleSettingsMap,
): IndexedTeamMember[] {
  if (mode === 'manual') return [...entries].sort((a, b) => a.originalIndex - b.originalIndex);
  return [...entries].sort((a, b) => {
    const rankDifference = getTeamRoleRank(a.member, roleSettings) - getTeamRoleRank(b.member, roleSettings);
    if (rankDifference !== 0) return rankDifference;
    const rawAOrder = Number(a.member.sortOrder);
    const rawBOrder = Number(b.member.sortOrder);
    const aOrder = Number.isFinite(rawAOrder) ? rawAOrder : a.originalIndex;
    const bOrder = Number.isFinite(rawBOrder) ? rawBOrder : b.originalIndex;
    return aOrder - bOrder || a.originalIndex - b.originalIndex;
  });
}

export const TEAM_ROLE_RANK_OPTIONS = [
  { value: 'auto', label: 'Tự xác định theo chức danh' },
  { value: '1', label: '1 · Lãnh đạo Mạng lưới' },
  { value: '2', label: '2 · Lãnh đạo cấp phó Mạng lưới' },
  { value: '3', label: '3 · Chánh Văn phòng / chức danh tương đương' },
  { value: '4', label: '4 · Phó Chánh Văn phòng / cấp phó tương đương' },
  { value: '5', label: '5 · Trưởng Ban / Trưởng đơn vị' },
  { value: '6', label: '6 · Phó Trưởng Ban / Phó đơn vị' },
  { value: '7', label: '7 · Thư ký / Điều phối' },
  { value: '8', label: '8 · Thành viên / Tình nguyện viên' },
  { value: '9', label: '9 · Chức danh khác' },
];

export const COMMON_TEAM_ROLES = [
  'Nhà Sáng Lập & Chủ Tịch',
  'Chủ Tịch',
  'Phó Chủ Tịch',
  'Tổng Thư Ký',
  'Chánh Văn Phòng',
  'Phó Chánh Văn Phòng',
  'Trưởng Ban',
  'Phó Trưởng Ban',
  'Thư Ký',
  'Điều Phối Viên',
  'Thành Viên',
  'Tình Nguyện Viên',
];
