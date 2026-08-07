import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
    title: string;
    href?: string;
}

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItemData[];
}

export function AppHeader({
    breadcrumbs,
}: AppHeaderProps) {
    return (
        <header
            className="
                sticky top-0 z-20
                flex h-[7vh] items-center
                border-b bg-white
                px-6
            "
        >
            <SidebarTrigger className='cursor-pointer' />

            <div className="ml-2">
                {breadcrumbs && (
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((item, index) => (
                                <div
                                    key={item.title}
                                    className="flex items-center"
                                >
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {item.title}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>

                                    {index <
                                        breadcrumbs.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                )}
            </div>
        </header>
    );
}