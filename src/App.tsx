import {Button} from "@/components/ui/button.tsx";

function App() {
    const handleClick = () => {
        const params = new URLSearchParams({
            response_type: "code",
            client_id: "86htpoghv1ptpr",
            redirect_uri: "http://localhost:5000/api/v1/linkedin/auth/callback",
            scope: "openid profile email",
        });

        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    };

    return (
        <div className="page-layout">
            <Button onClick={handleClick}>
                Login with LinkedIn
            </Button>
        </div>
    );
}

export default App;