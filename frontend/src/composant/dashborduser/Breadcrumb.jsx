import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
return (
    <div className="flex items-center space-x-2 mb-6">
        <Link 
        to="/" 
        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex gap-2"
        >
        <Home size={20} /> Accueil
        </Link>
        {items.map((item, index) => (
        <React.Fragment key={index}>
            <ChevronRight size={16} className="text-gray-400" />
            {item.link ? (
            <Link 
                to={item.link}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
                {item.text}
            </Link>
            ) : (
            <span className="text-gray-900 font-medium">{item.text}</span>
            )}
        </React.Fragment>
        ))}
    </div>
);
};

export default Breadcrumb;