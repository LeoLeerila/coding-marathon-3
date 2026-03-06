import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import useRegister from "../hooks/useRegister";

const Register = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const { register, isLoading, error } = useRegister("/api/auth/signup");

    const name = useField("text");
    const username = useField("text");
    const password = useField("password");
    const phone_number = useField("text")
    const date_of_birth = useField("date");
    const licenseNumber = useField("text");
    //address
    const licenseExpiryDate = useField("date");
    const city = useField("text");
    const yearsOfExperience = useField("number")

    const registerUser = async (e) => {
        e.preventDefault();
        const user = await register({
            fullname: name.value,
            username: username.value,
            password: password.value,
            phone_number: phone_number.value,
            date_of_birth: date_of_birth.value,
            licenseNumber: licenseNumber.value,
            address: {
                licenseExpiryDate: licenseExpiryDate.value,
                city: city.value,
                yearsOfExperience: yearsOfExperience.value
            }
        });
        if (user) {
            setIsAuthenticated(true);
            navigate("/");
        }

    }

    return (
        <div className="create">
            <h2>Sign Up</h2>
            <form onSubmit={registerUser}>
                <label>Name:</label>
                <input {...name} />
                <label>Username:</label>
                <input {...username} />
                <label>Password:</label>
                <input {...password} />
                <label>Phone Number:</label>
                <input {...phone_number} />
                <label>Date of birth:</label>
                <input {...date_of_birth} />
                <label>License number:</label>
                <input {...licenseNumber} />
                <label>License expiry date:</label>
                <input {...licenseExpiryDate} />
                <label>City:</label>
                <input {...city} />
                <label>Years of experience:</label>
                <input {...yearsOfExperience} />
                <button>Sign up</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default Register;