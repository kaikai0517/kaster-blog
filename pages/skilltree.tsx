import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { useThemeContext } from "../context/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const [theme, setTheme] = useThemeContext();
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="dark:bg-[#696B7B] dark:text-white">
        <div className="max-w-7xl mx-auto ">
          <Header />
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
          >
            <TreeItem nodeId="1" label="Applications">
              <TreeItem nodeId="2" label="Calendar" />
            </TreeItem>
            <TreeItem nodeId="5" label="Documents">
              <TreeItem nodeId="10" label="OSS" />
              <TreeItem nodeId="6" label="MUI">
                <TreeItem nodeId="8" label="index.js" />
              </TreeItem>
            </TreeItem>
          </TreeView>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
