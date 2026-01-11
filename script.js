// Import Firebase functions from the web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVzIwGYUysSCgFzWc-GsHBL5OCZ4rtEyc",
  authDomain: "an-news-d9145.firebaseapp.com",
  projectId: "an-news-d9145",
  storageBucket: "an-news-d9145.firebasestorage.app",
  messagingSenderId: "396973145618",
  appId: "1:396973145618:web:972a443eb164c0f25162cb",
  measurementId: "G-YJL5297ERY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LOGIC FOR ADMIN PAGE (ADD NEWS) ---
const newsForm = document.getElementById('add-news-form');
if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const imageUrl = document.getElementById('image-url').value;
        const description = document.getElementById('description').value;

        try {
            await addDoc(collection(db, "news"), {
                title: title,
                imageUrl: imageUrl,
                description: description,
                timestamp: new Date()
            });
            alert("News Added Successfully!");
            newsForm.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding news.");
        }
    });
}

// --- LOGIC FOR HOME PAGE (DISPLAY NEWS) ---
const newsContainer = document.getElementById('news-container');
if (newsContainer) {
    async function fetchNews() {
        newsContainer.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary"></div></div>';
        
        try {
            // Get news from 'news' collection
            const q = query(collection(db, "news"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            newsContainer.innerHTML = ''; // Clear loading spinner

            if(querySnapshot.empty){
                newsContainer.innerHTML = '<p class="text-center">No news found.</p>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const news = doc.data();
                const newsCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm news-card">
                            <img src="${news.imageUrl}" class="card-img-top" alt="News Image" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                            <div class="card-body">
                                <h5 class="card-title">${news.title}</h5>
                                <p class="card-text text-secondary">${news.description.substring(0, 100)}...</p>
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal-${doc.id}">Read More</button>
                            </div>
                        </div>
                    </div>
                `;
                newsContainer.innerHTML += newsCard;
            });

        } catch (error) {
            console.error("Error fetching news: ", error);
            newsContainer.innerHTML = '<p class="text-danger text-center">Error loading news.</p>';
        }
    }
    
    // Run the function when page loads
    fetchNews();
}
