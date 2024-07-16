

function signup() {
    event.preventDefault();
    const fullName = document.getElementById("fullname").value;
    const phoneNumber = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(fullName, phoneNumber, email, password);

    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, phoneNumber, email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status) {
                alert(data.message);
                window.location.href = "/login";
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}