import { useState, useRef } from "react";
import api from "../services/axios";

const initialState = {
  phone: "",
  email: "",
  name: "",
  dob: "",
  password: "",
  keepLoggedIn: false,
};

export default function useSignup() {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // errors via ref only
  const errorsRef = useRef({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const err = {};

    if (!values.phone) err.phone = "Mobile number is required";
    if (!values.email) err.email = "Email is required";
    if (!values.name) err.name = "Name is required";
    if (!values.dob) err.dob = "DOB is required";
    if (!values.password) err.password = "Password is required";

    errorsRef.current = err;
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post("/users/register", values);
      return res.data;
    } catch (e) {
      errorsRef.current = {
        server: e.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors: errorsRef.current,
    loading,
    handleChange,
    handleSubmit,
  };
}
