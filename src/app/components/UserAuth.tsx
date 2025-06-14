import type { NextPage } from 'next';
import Image from "next/image";
import styles from './UserAuth.module.css';


const SIGNIN:NextPage = () => {
  	return (
    		<div className={styles.signIn}>
      			<div className={styles.signInChild} />
      			<div className={styles.loginParent}>
        				<div className={styles.login}>Login</div>
        				<div className={styles.dontHaveAn}>Don’t have an account yet?</div>
          					<div className={styles.groupChild} />
          					<div className={styles.groupItem} />
          					<div className={styles.rectangleParent}>
            						<div className={styles.groupInner} />
            						<div className={styles.institutionalEmail}>Institutional Email</div>
            						<div className={styles.rectangleDiv} />
            						<div className={styles.password}>Password</div>
            						<div className={styles.usernamecitedu}>username@cit.edu</div>
            						<div className={styles.password1}>Password</div>
            						<div className={styles.forgotPassword}>Forgot Password?</div>
              							<Image className={styles.clarityeyeHideLineIcon} width={16} height={16} sizes="100vw" alt="" src="/clarity:eye-hide-line.svg" />
              							</div>
              							</div>
              							<div className={styles.signIn1}>SIGN IN</div>
              							<div className={styles.signUp}>SIGN UP</div>
              							<div className={styles.header}>
                								<div className={styles.options}>
                  									<div className={styles.home}>
                    										<div className={styles.home1}>Home</div>
                  									</div>
                  									<div className={styles.results}>
                    										<div className={styles.home1}>Results</div>
                  									</div>
                  									<div className={styles.updates}>
                    										<div className={styles.home1}>Updates</div>
                  									</div>
                  									<div className={styles.about}>
                    										<div className={styles.home1}>About</div>
                  									</div>
                								</div>
                								<div className={styles.univote}>UniVote</div>
                								<Image className={styles.websiteLogoIcon} width={146} height={120} sizes="100vw" alt="" src="/Website Logo.png" />
                								<div className={styles.signInButtonAnimation}>
                  									<b className={styles.signIn2}>SIGN IN</b>
                								</div>
              							</div>
              							</div>);
            						};
            						
            						export default SIGNIN;
            						