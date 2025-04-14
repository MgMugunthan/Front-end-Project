function generatePassword() {
    // Show loader
    document.getElementById("loader").style.display = "block";
    document.getElementById("password").textContent = "";
    document.getElementById("copy").disabled = true;

    setTimeout(function () {  // Simulate delay for password generation
        const length = document.getElementById("length").value;
        const useUppercase = document.getElementById("uppercase").checked;
        const useNumbers = document.getElementById("numbers").checked;
        const useSpecial = document.getElementById("special").checked;

        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const special = "!@#$%^&*()_+[]{}|;:,.<>?";
        
        let characters = lowercase;
        if (useUppercase) characters += uppercase;
        if (useNumbers) characters += numbers;
        if (useSpecial) characters += special;

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }

        // Hide loader and show result
        document.getElementById("loader").style.display = "none";
        document.getElementById("password").textContent = password;
        document.getElementById("copy").disabled = false;
    }, 1000);  // Delay to simulate loading
}

function copyPassword() {
    const password = document.getElementById("password").textContent;
    navigator.clipboard.writeText(password).then(() => {
        alert("Password copied to clipboard!");
    });
}
