import React from 'react';
import Header from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/header.js';
import PostFeed from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/postfeed.js';
import Footer from '/home/rguktongole/Desktop/ideanexus/frontend/src/components/footer.js';

const HomePage = () => {
  return (
    <div>
      {/* Header at the top */}
      <Header />

      {/* Main content area */}
      <div className="main-content">
        <PostFeed />
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default HomePage;
