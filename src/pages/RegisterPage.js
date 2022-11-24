import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button as AntButton } from "antd";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import { RegisterPageForm } from "../components/RegisterPageForm";

const RegisterPage = () => {
    return (
        <main className={styles.registerPageMain}>
            <div className={styles.registerBarDiv}>
                <div className={styles.registerDiv}>
                    <div className={styles.logoDiv}>
                        <Link className={styles.logoA} to="/auth/login">
                            Tron
                        </Link>
                    </div>
                    <i className={styles.bannerI}>User Registration</i>
                    <RegisterPageForm />
                </div>
            </div>
            <div className={styles.backgroundDiv}>
                <img
                    className={styles.eow74ye8vn3511Icon}
                    alt=""
                    src="../eow74ye8vn351-1@1x.png"
                />
            </div>
        </main>
    );
};

export default RegisterPage;
