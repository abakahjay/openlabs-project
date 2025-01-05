// import Cookie from '../../node_modules/js-cookie';
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId =urlParams.get("id")|| localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const userTok =urlParams.get("oven")
    // console.log(userId);
    
    const response = await fetch("/api/v1/auth/userId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId,userTok}),
    });

    let datas = await response.json();
    // console.log(datas);
    
    let token = datas.cookie?datas.cookie.token : datas.userTok;
    // console.log(token);
    // console.log(userId);
    if (!token) {
        window.location.href = "../login/login.html"; // Redirect if not logged in
        return;
    }
    

    // Fetch user details
    await fetch('/api/v1/auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
                window.location.href = "../login/login.html";
            } else {
                // console.log(data.user)
                // Display user details
                //It is advisable not to add the password to the user details
                const { username, email, profile_picture} = data.user;

                // Display username and email
                document.getElementById("user-name").innerText = username;
                document.getElementById("user-details").innerText = `Email: ${email}\nUsername: ${username}`;

                // Display profile picture (if available)
                document.getElementById("profile-pic").src = profile_picture;
                // localStorage.removeItem(`token-${userId}`);
                // localStorage.removeItem("userId");
                // token=data.token;
                // localStorage.setItem(`userId-${data.user._id}`,data.user._id);
                // localStorage.setItem(`token-${userId}`,data.token);

            }
        })
        .catch(() => alert("Failed to load user details."));
        // localStorage.removeItem(`token-${userId}`);
        // localStorage.removeItem("userId");

    // Logout
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem(`token-${userId}`);
        localStorage.removeItem("userId");
        localStorage.removeItem(`datas-${userId}`);
        window.location.href = "../login/login.html";
    });

    // Image Upload Functionality
    document.getElementById("upload-btn").addEventListener("click", async () => {
        //Common syntax for the file input level
        const fileInput = document.getElementById("file-input");
        const file = fileInput.files[0];



        // const imageFile = e.target.files[0];

        if (!file) {
            document.getElementById("upload-status").innerText = "Please select an image to upload.";
            return;
        }

        const formData = new FormData();
        formData.append("profile_picture", file);
        console.log(formData.get("profile_picture"));

        // Upload the image
        await fetch("/api/v1/auth/upload-profile-pic", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    document.getElementById("upload-status").innerText = "Profile picture uploaded successfully.";
                    document.getElementById("profile-pic").src = data.profile_picture;
                } else {
                    document.getElementById("upload-status").innerText = data.error || "Failed to upload image.";
                }
            })
            .catch((err) => {
                document.getElementById("upload-status").innerText ="Error uploading image.";
            });
    });




    document.getElementById("upload-btns").addEventListener("click", async () => {
        //Common syntax for the file input level
        const fileInput = document.getElementById("file-inputs");
        const file = fileInput.files[0];



        // const imageFile = e.target.files[0];

        if (!file) {
            document.getElementById("upload-statuss").innerText = "Please select an image to upload.";
            return;
        }

        const formDatas = new FormData();
        formDatas.append("profile_pictures", file);
        console.log(formDatas.get("profile_pictures"));

        // Upload the image
        await fetch("/api/v1/testing1/upload-profile-pic", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formDatas,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    document.getElementById("upload-statuss").innerText = "Profile picture uploaded successfully.";
                    document.getElementById("profile-pic").src = data.profile_picture;
                } else {
                    document.getElementById("upload-statuss").innerText = data.error || "Failed to upload image.";
                }
            })
            .catch((err) => {
                document.getElementById("upload-statuss").innerText ="Error uploading image.";
            });
    });
});
