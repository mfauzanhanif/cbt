import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    CalendarClock,
    FileSpreadsheet,
    FileText,
    FolderArchive,
    GraduationCap,
    HelpCircle,
    LayoutGrid,
    School,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth?: { user?: { roles?: string[] } } }>().props;
    const roles = auth?.user?.roles || [];

    const isAdmin = roles.includes('admin');
    const isDosen = roles.includes('dosen');
    const isMahasiswa = roles.includes('mahasiswa');

    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (isAdmin) {
        navItems.push(
            {
                title: 'Data Mahasiswa',
                href: '/admin/students',
                icon: Users,
            },
            {
                title: 'Data Dosen',
                href: '/admin/teachers',
                icon: GraduationCap,
            },
            {
                title: 'Kelola Kelas',
                href: '/courses',
                icon: School,
            },
            {
                title: 'Impor Pengguna',
                href: '/admin/import',
                icon: FileSpreadsheet,
            },
            {
                title: 'Bank Soal',
                href: '/questions',
                icon: HelpCircle,
            },
            {
                title: 'Paket Soal',
                href: '/question-packages',
                icon: FolderArchive,
            },
            {
                title: 'Jadwal Ujian',
                href: '/exams',
                icon: CalendarClock,
            }
        );
    } else if (isDosen) {
        navItems.push(
            {
                title: 'Kelas Saya',
                href: '/courses',
                icon: School,
            },
            {
                title: 'Bank Soal',
                href: '/questions',
                icon: HelpCircle,
            },
            {
                title: 'Paket Soal',
                href: '/question-packages',
                icon: FolderArchive,
            },
            {
                title: 'Jadwal Ujian',
                href: '/exams',
                icon: CalendarClock,
            }
        );
    } else if (isMahasiswa) {
        navItems.push(
            {
                title: 'Ujian Saya',
                href: '/student/exams',
                icon: FileText,
            },
            {
                title: 'Nilai Saya',
                href: '/student/grades',
                icon: Award,
            },
            {
                title: 'Kelas Terdaftar',
                href: '/courses',
                icon: School,
            }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r-2 border-border bg-secondary-background text-foreground">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
