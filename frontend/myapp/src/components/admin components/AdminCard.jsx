import { FaLongArrowAltRight } from "react-icons/fa";

const AdminCard = (prop) => {
    const { title, description, count, color, onClick } = prop;
    return (
        <div onClick={onClick} className={`relative group cursor-pointer bg-gradient-to-br ${color} rounded-3xl p-7 shadow-2xl hover:scale-[1.04] hover:shadow-black/40 transition-all`}>
            {count > 0 && (
                <span className="absolute top-5 right-5 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                    {count}
                </span>
            )}

            <h2 className="text-2xl font-bold mb-3">{title}</h2>
            <p className="text-white/80 text-sm mb-8">{description}</p>

            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm group-hover:bg-white/30 transition">
                Open
                <span className="transition group-hover:translate-x-1"><FaLongArrowAltRight /></span>
            </span>
        </div>
    );
};

export default AdminCard