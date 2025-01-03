import Link from "next/link";

interface DashboardCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
  }
  
  const DashboardCard = ({ title, description, icon, href }: DashboardCardProps) => {
    return (
      <Link href={href}>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-[#393939]">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  export default DashboardCard;