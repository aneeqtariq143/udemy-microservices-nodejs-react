// components/Header.tsx
import React from 'react';
import Link from 'next/link'
import {CurrentUserInterface} from "@/app/layout";

interface HeaderProps {
    currentUser: CurrentUserInterface | undefined;
}

const Header: React.FC<HeaderProps> = ({currentUser}) => {
    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link href={'/'}>
                        Gitix
                    </Link>
                </div>

                {/* Buttons */}
                <div className="space-x-4">
                    {!currentUser && (
                        <button
                            className="bg-transparent hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded">
                            <Link href={'/auth/signin'}>
                                Sign In
                            </Link>
                        </button>
                    )}
                    {!currentUser && (
                        <button
                            className="bg-transparent hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded">
                            <Link href={'/auth/signup'}>
                                Sign Up
                            </Link>
                        </button>
                    )}
                    {currentUser && (
                        <button
                            className="bg-transparent hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-600 rounded">
                            <Link href={'/auth/signout'}>
                                Sign Out
                            </Link>
                        </button>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Header;