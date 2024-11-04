import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import ButtonGradient from "../../assets/svg/ButtonGradient";
import SecondHeader from "../landing-page/SecondHeader";
import axios from "axios";
import Captcha from "../ui/Captcha";
import Swal from "sweetalert2";
import { FaPhone } from "react-icons/fa";
import { useTranslation } from "react-i18next"; 

interface FormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  captcha: boolean;
  phone: string;
  domain: string;
}

const Register = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
  });

  const {t} = useTranslation()

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");

  const [passwordStrength, setPasswordStrength] = useState({
    strength: "",
    percentage: 0,
    color: "red",
  });

  const validatePasswordStrength = (password: string) => {
    let strength = "";
    let percentage = 0;
    let color = "red";

    // Criteria for validation
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /\d/.test(password);
    const upperCriteria = /[A-Z]/.test(password);
    const lowerCriteria = /[a-z]/.test(password);
    const specialCriteria = /[#\$^+=!*()@%&]/.test(password);

    const fulfilledCriteria =
      +numberCriteria + +upperCriteria + +lowerCriteria + +specialCriteria;

    if (!lengthCriteria) {
      strength = "Terlalu Pendek";
      percentage = 0;
      color = "red";
    } else if (fulfilledCriteria === 1) {
      strength = "Lemah";
      percentage = 25;
      color = "red";
    } else if (fulfilledCriteria === 2) {
      strength = "Sedang";
      percentage = 50;
      color = "yellow";
    } else if (fulfilledCriteria === 3) {
      strength = "Kuat";
      percentage = 75;
      color = "lightgreen";
    } else if (fulfilledCriteria === 4) {
      strength = "Sangat Kuat";
      percentage = 100;
      color = "green";
    }

    setPasswordStrength({ strength, percentage, color });
  };

  useEffect(() => {
    if (password) validatePasswordStrength(password);
  }, [password]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const [captchaValid, setCaptchaValid] = useState<boolean>(false);

  const handleCaptchaVerification = (isValid: boolean) => {
    setCaptchaValid(isValid);
    if (isValid) {
      console.log("woii");
      clearErrors("captcha");
    } else {
      console.log("woii lahh");
      setError("captcha", { type: "manual", message: "Captcha is incorrect" });
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form Submitted");
    console.log("Captcha Valid on Submit:", captchaValid);
    if (!captchaValid) {
      Swal.fire("Capctha Wrong!", "Please solve the captcha correctly.", "error")
      return;
    }

    try {
      const emailCheckResponse = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/check-email/${
          data.email
        }`
      );
      const emailCheckResult = await emailCheckResponse.json();

      if (
        emailCheckResponse.status === 200 &&
        emailCheckResult.message === "Record Found"
      ) {
        Swal.fire("Error!", "Email already register", "error")
        return;
      }

      if (
        emailCheckResponse.status === 200 &&
        emailCheckResult.error.message === "Record not found"
      ) {
        const formData = new FormData();
        console.log("Form Data:", data);

        if (!data.password) {
          throw new Error("Password is required");
        }

        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.password) formData.append("password", data.password);
        if (data.phone) formData.append("phone_number", data.phone);
        if (data.domain) formData.append("domain_user", data.domain);

        const response = await axios.post(
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/register`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.message === "User registered successfully") {
          Swal.fire("Sucess!", "Register sucess", "success")
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
            Swal.fire("Error!", "Failed to register", "error")
        }

        console.log(response.data);
      }
    } catch (error) {
        Swal.fire("Error!", "Failed to register", "error")
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden mt-10">
      <SecondHeader />
      <div
        className="max-w-4xl mx-auto p-4 mt-9 mb-5 md:p-8 rounded-lg shadow-lg bg-white"
        style={{
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-5">
            {t("titleRegister")}
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                {t("FullName")}<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaUser className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Nama Lengkap Wajib diisi" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder={t("placeholderFullName")}
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                {t("Email")}<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaEnvelope className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email Wajib Diisi",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Format email tidak valid",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      type="email"
                      placeholder={t("placeholderEmail")}
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
                {t("Password")}<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative flex flex-col items-start border border-gray-300 rounded-md">
                <div className="w-full flex items-center">
                  <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Kata Sandi Wajib Diisi",
                      minLength: {
                        value: 8,
                        message: "Kata Sandi harus terdiri minimal 8 karakter",
                      },
                      validate: (value) => {
                        const hasUppercase = /[A-Z]/.test(value);
                        const hasLowercase = /[a-z]/.test(value);
                        if (!hasUppercase || !hasLowercase) {
                          return "Kata sandi harus mengandung huruf kecil dan huruf besar";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("placeholderPassword")}
                        className="w-full py-2 px-3 border-none outline-none"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mb-1 mt-2">
                <span className="text-red-500 ml-1">*</span>Password minimal 8
                karakter (kombinasi angka, huruf besar, huruf kecil, dan spesial
                karakter #$^+=!*()@%&)
              </p>
              {/* Password Strength Indicator */}
              <div className="mt-2 w-full">
                <p className={`text-${passwordStrength.color}-500 text-xs`}>
                  {passwordStrength.strength}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${passwordStrength.percentage}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
              {t("ConfirmPassword")}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mb-0 relative flex items-center border border-gray-300 rounded-md">
                <RiLockPasswordFill className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{
                    required: "Konfirmasi Kata Sandi Wajib Diisi",
                    validate: (value) =>
                      value === password || "Kata Sandi Tidak Sama",
                  }}
                  render={({ field }) => (
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("placeholderConfirmPassword")}
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
              {t("PhoneNumber")}<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaPhone className="ml-3 mr-3 text-gray-500" />
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Nomor Telepon Wajib Diisi",
                    pattern: {
                      value: /^[0-9]+$/, // Regex to allow only numbers
                      message: "Hanya boleh memasukkan angka",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      type="number"
                      placeholder={t("placeholderPhoneNumber")}
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 font-medium mb-2">
              {t("Domain")}<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="ml-3 mr-3 text-gray-500">sellinkit.shop/</span>
                <Controller
                  name="domain"
                  control={control}
                  rules={{ required: "Domain is required" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder={t("placeholderDomainUser")}
                      className="w-full py-2 px-3 border-none outline-none"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.domain && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.domain.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start rounded-md mb-4">
            <h1 className="text-lg font-bold mb-4">
              Captcha<span className="text-red-500 ml-1">*</span>
            </h1>
            <Controller
              name="captcha"
              control={control}
              render={({ field }) => (
                <Captcha
                  onVerify={(isValid) => {
                    handleCaptchaVerification(isValid);
                    field.onChange(isValid);
                  }}
                />
              )}
            />
            {errors.captcha && (
              <p className="text-red-500 mt-2">{errors.captcha.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-300 text-white py-2 px-4 rounded-md"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md shadow-md flex items-center"
            >
              <ButtonGradient />
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
