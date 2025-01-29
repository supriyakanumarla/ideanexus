const DashboardLayout = ({ children }) => {
  const user = {
    id: '123',
    profilePhoto: null // or URL to photo if exists
  };

  return (
    <div className="dashboard-layout">
      <Header user={user} />
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}; 