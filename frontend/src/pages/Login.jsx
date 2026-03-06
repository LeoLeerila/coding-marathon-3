import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useLogin("/api/auth/login");
    const username = useField("text");
    const password = useField("password");

    const loginUser = async (e) => {
        e.preventDefault();
        const user = await login({ 
            username: username.value, 
            password: password.value 
        });
        if (user) {
            setIsAuthenticated(true);
            navigate("/");
        }
    }
    return (
        <div className="create">
            <h2>Login</h2>
            <form onSubmit={loginUser}>
                <label>Username:</label>
                <input {...username} />
                <label>Password:</label>
                <input {...password} />
                <button>Log in</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default Login;