import React, { useState } from "react";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Added:", employee);
    setEmployee({
      name: "",
      email: "",
      role: ""
    });
    alert("Employee added successfully!");
  };

  return (
    <div className="add-employee-page">
      <div className="form-container">
        <h1>Add New Employee</h1>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={employee.role}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
