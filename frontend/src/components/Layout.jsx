function Layout({ children }) {
  return (
    <div style={styles.container}>
      {children}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    padding: "20px",
    boxSizing: "border-box"
  }
};

export default Layout;