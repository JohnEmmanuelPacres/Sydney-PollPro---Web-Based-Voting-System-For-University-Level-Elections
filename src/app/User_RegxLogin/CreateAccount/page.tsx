'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './CreateAccount.module.css';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    courseYear: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // Add your form submission logic here (e.g., API call)
  };

  return (
    <div className={styles.registration}>
      <div className={styles.logo}>
        <div className={styles.joinUs}>JOIN US</div>
      </div>

      <div className={styles.aboutUs}>
        <div className={styles.aboutUsChild} />
        <b className={styles.aboutUs1}>About Us</b>
        <b className={styles.forMoreInformation}>
          For more information, click the button below!
        </b>
      </div>

      <Image
        className={styles.formIcon}
        width={740.4}
        height={734.9}
        sizes="100vw"
        alt=""
        src="/form.png"
      />

      <b className={styles.register}>Register</b>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="University Email"
          className={styles.formItem}
          style={{
              position: 'absolute',
              width: '500px',
              height: '50px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              border: '1px solid #bcbec0',
              boxSizing: 'border-box',
              fontSize: '16px',
              paddingLeft: '24px',
              color: '#000',
            }}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="courseYear"
          placeholder="Course & Year"
          className={styles.formChild}
          style={{
              position: 'absolute',
              width: '500px',
              height: '50px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              border: '1px solid #bcbec0',
              boxSizing: 'border-box',
              fontSize: '16px',
              paddingLeft: '24px',
              color: '#000',
            }}
          value={formData.courseYear}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.formInner}
          style={{
              position: 'absolute',
              width: '500px',
              height: '50px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              border: '1px solid #bcbec0',
              boxSizing: 'border-box',
              fontSize: '16px',
              paddingLeft: '24px',
              color: '#000',
            }}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </form>

      <a className={styles.logInHere} href="/User_RegxLogin">Log in here</a>

      <button className={styles.register1} onClick={handleSubmit}>
        <div className={styles.registerChild} />
        <b className={styles.register2}>Register</b>
      </button>

      <Image
        className={styles.logoOfMsad1}
        width={147}
        height={147}
        sizes="100vw"
        alt=""
        src="/Website Logo.png"
      />
    </div>
  );
};

export default CreateAccount;