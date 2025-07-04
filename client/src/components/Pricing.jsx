"use client"

import { plans } from "../assets/assets"
import axios from "axios"
import { useAuth, useUser } from "@clerk/clerk-react"
import { AppContext } from "../context/AppContext"
import { useContext, useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Check, Star, Zap, Crown, Sparkles } from "lucide-react"

const Pricing = () => {
    const { getToken, isSignedIn } = useAuth()
    const { user } = useUser()
    const { backendUrl, loadUserCredit } = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const hasHandledPayment = useRef(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const status = searchParams.get("status")
        const orderId = searchParams.get("orderId")

        if (hasHandledPayment.current || (!status && !orderId)) {
            return
        }

        hasHandledPayment.current = true

        const handleCallback = async () => {
            if (status === "success") {
                toast.success("Payment successful!")
                await loadUserCredit()
            } else if (status === "cancel") {
                toast.error("Payment was cancelled.")
            } else if (status === "failed") {
                toast.error("Payment failed. Please try again.")
            }

            setTimeout(() => {
                navigate("/", { replace: true })
            }, 100)
        }

        handleCallback()
    }, [searchParams, loadUserCredit, navigate])

    const handleChoosePlan = async (plan) => {
        if (loading) return

        if (!isSignedIn || !user) {
            toast.error("Vui lòng đăng nhập để tiếp tục")
            return
        }

        setLoading(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("Không thể lấy token xác thực")

            const orderPayload = {
                plan: plan.name,
                amount: plan.price,
                credits: Number.parseInt(plan.credits.split(" ")[0]),
            }

            const orderRes = await axios.post(`${backendUrl}/orders`, orderPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            })

            const orderId = orderRes.data.orderId
            if (!orderId) throw new Error("Không nhận được orderId từ server")

            const currentUrl = window.location.origin + window.location.pathname
            const paymentParams = {
                orderId,
                amount: plan.price,
                successUrl: `${currentUrl}?status=success&orderId=${orderId}`,
                cancelUrl: `${currentUrl}?status=cancel&orderId=${orderId}`,
                failUrl: `${currentUrl}?status=failed&orderId=${orderId}`,
            }

            const paymentRes = await axios.get(`${backendUrl}/payment/create`, {
                params: paymentParams,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            })

            const paymentUrl = paymentRes.data
            if (!paymentUrl) throw new Error("Không nhận được URL thanh toán từ server")

            window.location.href = paymentUrl
        } catch (err) {
            let errorMessage = "Không thể khởi tạo thanh toán. Vui lòng thử lại."

            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                        break
                    case 403:
                        errorMessage = "Không có quyền truy cập. Token có thể đã hết hạn hoặc không hợp lệ."
                        break
                    case 404:
                        errorMessage = "Không tìm thấy API endpoint. Vui lòng kiểm tra cấu hình backend."
                        break
                    case 500:
                        errorMessage = "Lỗi server. Vui lòng thử lại sau."
                        break
                    default:
                        if (err.response.data) {
                            errorMessage =
                                typeof err.response.data === "string" ? err.response.data : err.response.data.message || errorMessage
                        }
                }
            } else if (err.request) {
                errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
            } else {
                errorMessage = err.message
            }

            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const getPlanIcon = (planId) => {
        switch (planId) {
            case "Basic":
                return <Zap className="w-8 h-8" />
            case "Premium":
                return <Star className="w-8 h-8" />
            case "Ultimate":
                return <Crown className="w-8 h-8" />
            default:
                return <Sparkles className="w-8 h-8" />
        }
    }

    const getPlanGradient = (planId, popular) => {
        if (popular) {
            return "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
        }
        switch (planId) {
            case "Basic":
                return "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
            case "Ultimate":
                return "bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200"
            default:
                return "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
        }
    }

    const getTextColor = (popular) => {
        return popular ? "text-white" : "text-gray-900"
    }

    const getSubTextColor = (popular) => {
        return popular ? "text-purple-100" : "text-gray-600"
    }

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-700">Pricing Plans</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Choose Your Perfect{" "}
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Package</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Unlock the power of AI background removal with our flexible pricing options designed for every need.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`relative group ${getPlanGradient(plan.id, plan.popular)} rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${plan.popular ? "shadow-2xl ring-4 ring-purple-200" : "shadow-lg hover:shadow-xl"
                                }`}
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                        <Crown className="w-4 h-4" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Icon */}
                            <div className={`inline-flex p-3 rounded-2xl mb-6 ${plan.popular ? "bg-white/20" : "bg-purple-100"}`}>
                                <div className={plan.popular ? "text-white" : "text-purple-600"}>{getPlanIcon(plan.id)}</div>
                            </div>

                            {/* Plan Name */}
                            <h3 className={`text-2xl font-bold mb-2 ${getTextColor(plan.popular)}`}>{plan.name}</h3>

                            {/* Plan Description */}
                            <p className={`text-sm mb-6 ${getSubTextColor(plan.popular)}`}>{plan.description}</p>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl font-bold ${getTextColor(plan.popular)}`}>
                                        {plan.price.toLocaleString("vi-VN")}
                                    </span>
                                    <span className={`text-lg font-medium ${getSubTextColor(plan.popular)}`}>VND</span>
                                </div>
                                <div className={`text-sm mt-1 ${getSubTextColor(plan.popular)}`}>One-time payment</div>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-full ${plan.popular ? "bg-white/20" : "bg-green-100"}`}>
                                        <Check className={`w-4 h-4 ${plan.popular ? "text-white" : "text-green-600"}`} />
                                    </div>
                                    <span className={`font-medium ${getTextColor(plan.popular)}`}>{plan.credits}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-full ${plan.popular ? "bg-white/20" : "bg-green-100"}`}>
                                        <Check className={`w-4 h-4 ${plan.popular ? "text-white" : "text-green-600"}`} />
                                    </div>
                                    <span className={`${getSubTextColor(plan.popular)}`}>High-quality results</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-full ${plan.popular ? "bg-white/20" : "bg-green-100"}`}>
                                        <Check className={`w-4 h-4 ${plan.popular ? "text-white" : "text-green-600"}`} />
                                    </div>
                                    <span className={`${getSubTextColor(plan.popular)}`}>Fast processing</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-full ${plan.popular ? "bg-white/20" : "bg-green-100"}`}>
                                        <Check className={`w-4 h-4 ${plan.popular ? "text-white" : "text-green-600"}`} />
                                    </div>
                                    <span className={`${getSubTextColor(plan.popular)}`}>24/7 support</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => handleChoosePlan(plan)}
                                disabled={loading || !isSignedIn}
                                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${plan.popular
                                        ? "bg-white text-purple-600 hover:bg-gray-50 shadow-lg"
                                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                                        Processing...
                                    </div>
                                ) : !isSignedIn ? (
                                    "Please Sign In"
                                ) : (
                                    "Get Started"
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <p className="text-gray-600 mb-4">Need a custom solution?</p>
                    <button className="text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-4 decoration-2 hover:decoration-purple-700 transition-colors">
                        Contact our sales team
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Pricing
