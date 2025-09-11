"use client";

import React, { useState, useEffect } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BulkUser } from "@/types/apiTypes";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Send } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";



export default function PayZapDashboard() {
    const [search, setSearch] = useState("");
    const [balance, setBalance] = useState("");
    const [users, setUsers] = useState<BulkUser[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState<BulkUser | null>(null);
    const [amount, setAmount] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const session = useSession();
    const token = session.data?.user.token;
    console.log("token=", token);

    // Filter users based on search text
    const filteredUsers = users?.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    // Logout handler
    const handleLogout = () => {
        signOut({ callbackUrl: '/signin' }); // or wherever you want to redirect
    };

    // const handleSendMoney = async () => {
    //     if (!amount || !selectedUser) return;

    //     try {
    //         const sendMoney = async () => {
    //             try {
    //                 const res = await axios.post("http://localhost:5000/api/v1/account/transfer", {
    //                     amount: amount,
    //                     to: selectedUser.id
    //                 }, {
    //                     headers: {
    //                         'Authorization': `Bearer ${token}`
    //                     }
    //                 });
    //                 setUsers(res.data.users);
    //             } catch (err) {
    //                 console.error("Error fetching users:", err);
    //             }
    //         };
    //         sendMoney();

    //         setAmount("");
    //         setIsModalOpen(false);
    //         setSelectedUser(null);
    //     } catch (error) {
    //         console.error("Error sending money:", error);
    //     }
    // };


    const handleSendMoney = async () => {
        if (!amount || !selectedUser || !token) return;

        try {
            const res = await axios.post("http://localhost:5000/api/v1/account/transfer", {
                amount: parseFloat(amount), // Convert to number
                to: selectedUser.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Show success message
            alert(`Successfully sent ₹${amount} to ${selectedUser.username}`);

            // Refresh user's balance after successful transfer
            const balanceRes = await axios.get("http://localhost:5000/api/v1/user/personalInfo", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBalance(balanceRes.data.users.account.balance);

            // Reset form and close modal
            setAmount("");
            setIsModalOpen(false);
            setSelectedUser(null);

        } catch (error: any) {
            console.error("Error sending money:", error);

            // Show appropriate error message
            if (error.response?.data?.message) {
                alert(`Transfer failed: ${error.response.data.message}`);
            } else {
                alert("Transfer failed. Please try again.");
            }
        }
    };

    useEffect(() => {
        if (!token) return;
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/user/bulk", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(res.data.users);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, [token]);

    useEffect(() => {
        if (!token) return; // Exit early if no token

        const fetchUserInfo = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/user/personalInfo", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("personalInfo", res.data.users.account.balance);
                setBalance(res.data.users.account.balance);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUserInfo();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header with User Info and Logout */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                    <p className="text-gray-600">Welcome back!</p>
                </div>

                {/* User Profile & Logout Section */}
                <div className="relative">
                    <div className="flex items-center space-x-3">
                        <span className="text-gray-700 font-medium">
                            {session.data?.user?.username}
                        </span>

                        {/* User Avatar with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold hover:scale-105 transition-transform"
                            >
                                {session.data?.user?.username?.charAt(0).toUpperCase()}
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <div className="p-3 border-b">
                                        <p className="font-semibold text-gray-800">
                                            {session.data?.user?.username}
                                        </p>
                                        {/* <p className="text-sm text-gray-500">
                                            {session.data?.user?.firstame}
                                        </p> */}
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center space-x-2 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Balance Card */}
            <div className="mb-10 rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">
                    Welcome to PayZap
                </h1>
                <div className="mt-4 text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {balance ? (
                        <TextGenerateEffect
                            key={balance}
                            words={`Your balance: Rs. ${balance}`}
                            duration={2}
                        />
                    ) : (
                        <TextGenerateEffect
                            words={`Your balance: Rs. ...`}
                            duration={1}
                        />
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 max-w-md">
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {users && filteredUsers.map((user) => (
                    <CardContainer key={user.id as string} className="w-full">
                        <CardBody className="h-32 flex flex-col justify-between p-4 bg-white rounded-xl shadow-md border border-gray-100">
                            <CardItem translateZ="40" className="text-base font-medium">
                                {user.username}
                            </CardItem>
                            {/* <Button
                                className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors duration-300"
                            >
                                Send Money
                            </Button> */}
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={() => setSelectedUser(user)}
                                        className="bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors duration-300"
                                    >
                                        Send Money
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <div className="flex flex-col items-center mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                                                {selectedUser?.username.charAt(0).toUpperCase()}
                                            </div>
                                            <DialogTitle className="text-center">
                                                Send Money to {selectedUser?.username}
                                            </DialogTitle>
                                            <DialogDescription className="text-center">
                                                Enter the amount you want to send to @{selectedUser?.username}
                                            </DialogDescription>
                                        </div>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        {/* Amount Input */}
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <label htmlFor="amount" className="text-right font-medium">
                                                Amount
                                            </label>
                                            <div className="col-span-3 relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                                                    ₹
                                                </span>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="pl-8"
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        {/* Quick Amount Buttons */}
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <label className="text-right font-medium">Quick</label>
                                            <div className="col-span-3 grid grid-cols-4 gap-2">
                                                {[100, 500, 1000, 2000].map((quickAmount) => (
                                                    <Button
                                                        key={quickAmount}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setAmount(quickAmount.toString())}
                                                        className="text-xs"
                                                    >
                                                        ₹{quickAmount}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Transaction Summary */}
                                        {amount && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">You're sending:</span>
                                                    <span className="text-lg font-bold text-blue-600">₹{amount}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-sm text-gray-600">To:</span>
                                                    <span className="text-sm font-medium">@{selectedUser?.username}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setAmount("");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSendMoney}
                                            disabled={!amount}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Send ₹{amount || '0'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardBody>
                    </CardContainer>
                ))}
                {filteredUsers?.length === 0 && (
                    <p className="col-span-full text-gray-500 text-center">No users found</p>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}