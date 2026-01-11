// Import Firebase functions from the web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- STEP 1: PASTE YOUR FIREBASE CONFIG HERE ---
// (यह कोड आपको Firebase Console से मिला था, उसे यहाँ पेस्ट करें)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
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
