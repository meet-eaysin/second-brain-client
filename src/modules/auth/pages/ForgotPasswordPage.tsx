export const ForgotPasswordPage = () => {
    return (
        <div className="space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
            </div>
            <form className="space-y-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    )
}
