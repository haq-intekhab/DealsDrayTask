import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState("");
  const [open, setOpen] = useState(false);
  const [pic, setPic] = useState("");
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    gender: "",
    course: "",
    img: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFormData();
    setEmployeeId(null);
    setEdit(false);
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    console.log(sortValue);
    setSortType(sortValue);
    sortData(sortValue);
  };

  const sortData = (type) => {
    let newData = [...data];
    switch (type) {
      case "Date":
        newData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Name":
        newData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Email":
        newData.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case "ID":
        newData.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }
    setData(newData);
  };

  // const handleSearch = async (e) => {
  //   console.log(search);
  //   const inputValue = e.target.value;
  //   setSearch(inputValue);
  //   if (!inputValue) {
  //     setData(employees); // Show all employees when input is empty
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `http://localhost:4000/api/employee/${search}`
  //     );
  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //   }
  // };

  const handleSearch = async (e) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
    if (!inputValue) {
      setData(employees); // Show all employees when input is empty
      return;
    }
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url:`http://localhost:4000/api/employee/${search}`,
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      console.log(response.data);
      setData(response.data);
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        course: checked ? value : "", // Allow only one course
      }));
    } else if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        gender: value,
      }));
    } else if (type === "file") {
      if (files && files.length > 0) {
        setFormData((prev) => ({
          ...prev,
          img: files[0], // Store the file object
        }));
      }
    } else {
      // This will handle the position (select) and other inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log(employeeId);
      let response;

      if (employeeId) {
        // Edit existing employee
        response = await axios.put(
          `http://localhost:4000/api/editemployee/${employeeId}`,
          formData,
          config
        );
      } else {
        // Create new employee
        response = await axios.post(
          "http://localhost:4000/api/createemployee",
          formData,
          config
        );
      }

      console.log(response);
      
      if (response) {
        fetchEmployees();
        toast.success(
          employeeId
            ? "Employee Updated Succesfully"
            : "Employee Created successfully!"
        );
        window.location.reload();
      } else {
        toast.error("Employee exists!");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
 

    handleClose();
    resetFormData();
    setEmployeeId(null);
  };

  function resetFormData() {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      gender: "",
      course: "",
      img: "",
    });
  }

  const handleImageChange = async (pics) => {
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat_app");

      return axios
        .post("https://api.cloudinary.com/v1_1/dqclqq2jy/image/upload/", data, {
          onUploadProgress: (ProgressEvent) => {},
        })

        .then(({ data }) => {
          data.secure_url = "" + data.secure_url;
          setPic(data.secure_url.toString());
          console.log(data.url.toString());
          setPic(data.url.toString());
          console.log(
            "UPLOAD COMPLETE: " + JSON.stringify(data.url.toString())
          );
          formData.img = data.url.toString();
          console.log(formData);
          console.log(pic);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  const handleEditEmployee = (id) => {
    setEdit(true);
    const employee = data.find((employee) => employee._id === id);
    if (!employee) {
      console.error("Employee not found");
      return;
    }
    console.log(employee);
    setEmployeeId(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      gender: employee.gender,
      course: employee.course,
      img: employee.img,
    });
    // console.log(formData);
    handleClickOpen();
  };

  const [employees, setEmployees] = useState([]);
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/getemployee");
      const data1 = response.data;
      setEmployees(data1);
      setData(data1);
    } catch (error) {
      console.error("Error fetching employee:", error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  },[]);

  const deleteEmployee = (id) => {
    console.log(id);
    toast((t) => (
      <div className="flex justify-between items-center">
        <h2 className=" font-[600] text-[.9rem] leading-[1.8rem] p-1">
          Are you sure you want to delete this employee?
        </h2>
        <div className="flex gap-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={async () => {
              try {
                await axios.delete(
                  `http://localhost:4000/api/deleteemployee/${id}`
                );
                setData((prevEmployees) =>
                  prevEmployees.filter((employee) => employee._id !== id)
                );
                toast.dismiss(t.id);
                window.location.reload();
              } catch (error) {
                console.error("Error deleting employee:", error.message);
                toast.dismiss(t.id);
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-green-400 text-white px-4 py-2 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const Pagination = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const maxPage = Math.ceil(data?.length / itemsPerPage);

    function currentPageData() {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return data?.slice(startIndex, startIndex + itemsPerPage);
    }

    function goToPage(pageNumber) {
      setCurrentPage(pageNumber);
    }

    const renderPageNumbers = () => {
      const pageNumbers = [];
      let itemsToShow = 3; // Number of pages to show before and after the current page
      let start = Math.max(currentPage - itemsToShow, 1);
      let end = Math.min(currentPage + itemsToShow, maxPage);

      if (start > 1) {
        pageNumbers.push(1);
        if (start > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < maxPage) {
        if (end < maxPage - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(maxPage);
      }

      return pageNumbers?.map((number, index) =>
        number === "..." ? (
          <span key={index} className="page-item dots">
            {number}
          </span>
        ) : (
          <button
            key={index}
            onClick={() => goToPage(number)}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            {number}
          </button>
        )
      );
    };

    return (
      <div>
        {/* Render the current page's data */}
        {currentPageData()?.map((data, i) => (
          <div key={i} className="w-full flex gap-8 p-4 border-b ">
            <div className="w-[60%] flex justify-between items-center">
              <div className="w-[15%] flex justify-between items-center">
                <p className="text-[#1C2434] text-[14px] font-semibold">
                  {data._id ? data._id.slice(-3) : "N/A"}
                </p>
                <p className="text-[#1C2434] text-[14px]">
                  <img src={data?.imgUrl} className="w-[80%] mx-auto h-10" />
                </p>
              </div>
              <div className="w-[55%] flex justify-between items-center">
                <p className="text-[#1C2434] text-[14px]">{data.name}</p>
                <p className="text-[#1C2434] text-[14px] font-semibold">
                  {data.email}
                </p>
                <p className="text-[#1C2434] text-[14px] font-semibold">
                  {data.phone}
                </p>
              </div>
              <div className="w-[20%] flex justify-between items-center">
                <p className="text-[#1C2434] text-[14px] font-semibold">
                  {data.position}
                </p>
                <p className="text-[#1C2434] text-[14px] font-semibold">
                  {data.gender}
                </p>
              </div>
            </div>
            <div className="w-[40%] flex justify-between items-center">
              <div className="w-[50%] flex justify-evenly">
                <p className="text-[#10B981] text-[14px] font-semibold">
                  {data.course}
                </p>
                <p className="text-[#ED7770] text-[14px] font-semibold">
                  {new Date(data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="w-[50%] flex justify-evenly">
                <button
                  onClick={() => handleEditEmployee(data._id)}
                  className="bg-[#10B981] text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEmployee(data._id)}
                  className="bg-[#c63d33] text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-between px-8  mt-7 sm:flex-row flex-col sm:gap-0 gap-4">
          {/* Pagination controls */}
          {/* Dropdown for items per page */}
          <div className="items-per-page">
            <label htmlFor="items-per-page">Items per page:</label>
            <select
              className="border-2 mx-2 rounded-md"
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value="6">6</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div className="flex gap-5">
            <button
              className="page-item"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <GrFormPrevious />
            </button>
            <div className="flex gap-3">{renderPageNumbers()}</div>
            <button
              className="page-item"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === maxPage}
            >
              <MdNavigateNext />
            </button>
          </div>

          <div className="current-page sm:block hidden">
            Page {currentPage} of {maxPage}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="main" className="w-full h-fit relativ sm:mb-0 mb-10 ">
      <Dialog
        aria-labelledby="dialog-title"
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle id="dialog-title">
          {edit ? "Edit Employee" : "Create Employee"}
          <IconButton style={{ float: "right" }} onClick={handleClose}>
            <RxCrossCircled />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex md:flex-row flex-col gap-6">
                <label className="w-full font-semibold text-left text-m flex flex-col gap-3">
                  Name
                  <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Employee Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-full text-richblack-5 outline-none"
                    />
                  </div>
                </label>
              </div>
              <div className="w-full flex md:flex-row flex-col gap-6">
                <label className="w-full font-semibold text-left text-m flex flex-col gap-3">
                  Email
                  <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Employee Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-full text-richblack-5 outline-none"
                    />
                  </div>
                </label>
              </div>
              <div className="w-full flex md:flex-row flex-col gap-6">
                <label className="w-full font-semibold text-left text-m flex flex-col gap-3">
                  Contact Number
                  <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                    <input
                      type="number"
                      name="phone"
                      placeholder="Employee Contact Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-full text-richblack-5 outline-none"
                    />
                  </div>
                </label>
              </div>
              <div className="w-full flex md:flex-row flex-col items-center gap-6">
                <label className="w-full font-semibold text-left text-m flex flex-col gap-3">
                  Designation
                  <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full h-full text-richblack-5 outline-none"
                    >
                      <option value="">Select Role</option>
                      <option value="hr">HR</option>
                      <option value="manager">Manager</option>
                      <option value="sales">Sales</option>
                    </select>
                  </div>
                </label>
              </div>
              <div className="w-full flex items-center gap-6">
                <div className="w-full flex flex-col gap-3">
                  <span className="font-semibold text-left text-m">Gender</span>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <span className="font-semibold text-left text-m">Course</span>
                  <div className="flex gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="course"
                        value="mca"
                        checked={formData.course === "mca"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      MCA
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="course"
                        value="bca"
                        checked={formData.course === "bca"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      BCA
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="course"
                        value="bsc"
                        checked={formData.course === "bsc"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      BSC
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-fit mt-3">
                <label className="w-fit font-semibold text-left text-m flex flex-col gap-3">
                  Upload Image
                  <input
                    type="file"
                    name="img"
                    accept="image/*" // Accepts image files only
                    //onChange={handleImageChange}
                    onChange={(e) => handleImageChange(e.target.files[0])}
                    className="w-full text-richblack-5 outline-none"
                  />
                </label>
              </div>
            </div>
            <div className="w-full flex gap-3 justify-end mt-6">
              <button
                className="text-[white] bg-[#3ad7d7] py-2 px-3 rounded-md flex w-30% justify-center items-center font-[600] text-[.9rem] leading-[1.6rem]"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="text-[white] bg-[#3ad7d7] py-2 px-3 rounded-md flex w-30% justify-center items-center font-[600] text-[.9rem] leading-[1.6rem]"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Navbar />

      <div className="w-full flex flex-col justify-center items-center mt-[70px]">
        <div className="w-full flex gap-4 sm:px-6 px-4 mt-6 ">
          <div className="w-full flex justify-between items-center bg-[#F7F9FC] p-4">
            <p className="text-md text-[#64748B] font-semibold ">
              No. of Empolees :{" "}
              <span className="text-md text-[#64748B] font-semibold">
                {data?.length}
              </span>
            </p>
            <button
              onClick={handleClickOpen}
              className="text-[white] bg-[#3ad7d7] py-2 px-3 rounded-md flex w-30% justify-center items-center font-[600] text-[.9rem] leading-[1.6rem]"
            >
              Create Employee
            </button>
          </div>
        </div>

        <div className="w-full flex gap-4 sm:px-6 px-4">
          <div className="w-full flex justify-between items-center bg-[#F7F9FC] pt-2 pb-4 px-4">
            <div className="relative sm:w-[20%] w-full flex items-center rounded-md border border-[#3ad7d7]">
              <select
                name="sort_by"
                value={sortType}
                onChange={handleSortChange}
                className="w-full sm:py-2 py-4 px-2 rounded-lg outline-none"
              >
                <option value="">Sort By</option>
                <option value="Name">Name</option>
                <option value="Email">Email</option>
                <option value="Date">Create Date</option>
                <option value="ID">ID</option>
              </select>
            </div>
            <div className="relative sm:w-[35%] w-full flex items-center rounded-md border border-[#3ad7d7]  ">
              <input
                className="w-full sm:py-2 py-4 px-8 rounded-lg"
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search employee ..."
              />
              <CiSearch className="absolute text-[1.3rem] font-semibold ml-2 " />
            </div>
          </div>
        </div>

        <div className="w-full sm:px-6 px-4 mt-6">
          <h2 className="text-3xl font-semibold text-left">Employee List</h2>
        </div>

        <div className="w-full mb-6 mt-3 sm:px-6 px-4">
          <div className="w-full h-fit bg-white px-1 py-4 shadow-md">
            <div className="w-full bg-[#F7F9FC] flex gap-10 p-4">
              <div className="w-[60%] flex justify-between">
                <div className="w-[15%] flex justify-between">
                  <p className="text-[#64748B] text-[12px] font-semibold">Id</p>
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Image
                  </p>
                </div>
                <div className="w-[55%] flex justify-between">
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Name
                  </p>
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Email
                  </p>
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Phone
                  </p>
                </div>
                <div className="w-[20%] flex justify-between">
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Designation
                  </p>
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Gender
                  </p>
                </div>
              </div>
              <div className="w-[40%] flex justify-between">
                <div className="w-[50%] flex justify-evenly">
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Course
                  </p>
                  <p className="text-[#64748B] text-[12px] font-semibold">
                    Create date
                  </p>
                </div>
                <div className="w-[50%]">
                  <p className="text-[#64748B] text-center text-[12px] font-semibold">
                    Action
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-fit ">
              <Pagination data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
