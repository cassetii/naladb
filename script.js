// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAi53ISUus9hZvOGNQLQYH22US39r60kEs",
    authDomain: "corsecdatabase.firebaseapp.com",
    projectId: "corsecdatabase",
    storageBucket: "corsecdatabase.firebasestorage.app",
    messagingSenderId: "352663886420",
    appId: "1:352663886420:web:a62bd417bb1b2bd9342bc1",
    measurementId: "G-LLE3WFY0GY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===========================
// ======== INDEX.HTML =======
// ===========================

if (window.location.pathname.includes("index.html")) {
    const customerForm = document.getElementById("customerForm");
    const jumlahAC = document.getElementById("jumlahAC");
    const acFieldsContainer = document.getElementById("acFields");

    // Handle dynamic fields based on jumlahAC
    jumlahAC.addEventListener("change", function () {
        const unitCount = parseInt(this.value);
        acFieldsContainer.innerHTML = ""; // Reset fields

        if (unitCount > 0) {
            for (let i = 1; i <= unitCount; i++) {
                const fieldset = document.createElement("fieldset");
                fieldset.innerHTML = `
                    <legend>Unit AC ${i}</legend>
                    <label>Model AC:</label>
                    <select name="model${i}" required>
                        <option value="Midea">Midea</option>
                        <option value="Daikin">Daikin</option>
                        <option value="LG">LG</option>
                        <option value="Toshiba">Toshiba</option>
                        <option value="Panasonic">Panasonic</option>
                        <option value="TCL">TCL</option>
                        <option value="Changhong">Changhong</option>
                        <option value="Samsung">Samsung</option>
                    </select>

                    <label>Type Freon:</label>
                    <select name="freon${i}" required>
                        <option value="R32">R32</option>
                        <option value="R410">R410</option>
                        <option value="R22">R22</option>
                    </select>

                    <label>Kapasitas:</label>
                    <select name="kapasitas${i}" required>
                        <option value="1/2pk">1/2pk</option>
                        <option value="1pk">1pk</option>
                        <option value="1.5pk">1.5pk</option>
                        <option value="2pk">2pk</option>
                        <option value="3pk">3pk</option>
                        <option value="5pk">5pk</option>
                    </select>

                    <label>Jenis:</label>
                    <select name="jenis${i}" required>
                        <option value="Inverter">Inverter</option>
                        <option value="Non Inverter">Non Inverter</option>
                    </select>
                `;
                acFieldsContainer.appendChild(fieldset);
            }
        }
    });

    // Handle Form Submission
    customerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Gather Form Data
        const nama = document.getElementById("nama").value;
        const nomor = document.getElementById("nomor").value;
        const alamat = document.getElementById("alamat").value;
        const jumlah = jumlahAC.value;

        const unitAC = [];
        for (let i = 1; i <= jumlah; i++) {
            unitAC.push({
                model: document.querySelector(`[name="model${i}"]`).value,
                freon: document.querySelector(`[name="freon${i}"]`).value,
                kapasitas: document.querySelector(`[name="kapasitas${i}"]`).value,
                jenis: document.querySelector(`[name="jenis${i}"]`).value,
            });
        }

        // Save to Firestore
        try {
            await addDoc(collection(db, "customers"), {
                nama,
                nomor,
                alamat,
                jumlahAC: jumlah,
                unitAC
            });
            alert("Data pelanggan berhasil disimpan!");
            customerForm.reset();
            acFieldsContainer.innerHTML = "";
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    });
}

// ============================
// ======= DATABASE.HTML ======
// ============================

if (window.location.pathname.includes("database.html")) {
    const tableBody = document.querySelector("#dataTable tbody");

    // Fetch and Display Data from Firestore
    async function fetchData() {
        const querySnapshot = await getDocs(collection(db, "customers"));
        tableBody.innerHTML = ""; // Clear Table

        querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${data.nama}</td>
                    <td>${data.nomor}</td>
                    <td>${data.alamat}</td>
                    <td>${data.jumlahAC}</td>
                    <td>
                        <button onclick="viewDetails(${JSON.stringify(data.unitAC)})">View</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    window.viewDetails = function (unitAC) {
        const details = unitAC.map((ac, index) =>
            `Unit ${index + 1}: Model ${ac.model}, Freon ${ac.freon}, Kapasitas ${ac.kapasitas}, Jenis ${ac.jenis}`
        ).join("\n");
        alert(details);
    };

    // Fetch data on load
    fetchData();
}
