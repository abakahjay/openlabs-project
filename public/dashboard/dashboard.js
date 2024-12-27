// import Cookies from "../js-cookie-main/index.js";


document.addEventListener("DOMContentLoaded", async () => {
    // const token = Cookies.get("authToken");
    // console.log("Token from Cookie:", token);
    // const userId = localStorage.getItem("userId")//||localStorage.getItem(`userId-${data.user._id}`);
    let token = localStorage.getItem(`token-${userId}`);
    let hmm;
    console.log(token);
    console.log(userId);

    // if (!token) {
    //     window.location.href = "../login/login.html"; // Redirect if not logged in
    //     return;
    // }

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
                console.log(data.user)
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
    // localStorage.removeItem("userId");

    // Logout
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem(`token-${userId}`);
        localStorage.removeItem("userId");
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
});
