import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="container mt-5">
            <h4 className="text-center mb-4">Privacy Policy</h4>
            <div className="row">
                <div className="col-md-12">
                    <div className="policy-section p-4 mb-4 bg-light rounded">
                        <h5>Information Collection and Use</h5>
                        <p>
                            We collect various types of information when you use our services, including personal 
                            information such as your name, email address, phone number, shipping address, and 
                            payment details. This information is used to process your orders, provide customer 
                            support, personalize your experience, and communicate with you about our products, 
                            services, and promotions.
                        </p>
                        <p>
                            We also collect non-personal information such as your IP address, browser type, 
                            device information, and browsing behavior. This information is used for analytical 
                            purposes to improve our website's functionality, performance, and user experience.
                        </p>
                    </div>
                    <div className="policy-section p-4 mb-4 bg-light rounded">
                        <h5>Cookie Policy</h5>
                        <p>
                            We use cookies, web beacons, and similar technologies to track your preferences, 
                            analyze traffic patterns, and customize your experience on our website. Cookies are 
                            small text files that are stored on your device when you visit our website. They 
                            help us remember your preferences, provide personalized recommendations, and deliver 
                            targeted advertisements based on your interests.
                        </p>
                        <p>
                            You can control and manage cookies through your browser settings. Please note that 
                            disabling cookies may affect your browsing experience and limit the functionality 
                            of certain features on our website.
                        </p>
                    </div>
                    <div className="policy-section p-4 mb-4 bg-light rounded">
                        <h5>Data Security</h5>
                        <p>
                            We prioritize the security of your personal information and implement industry-standard 
                            measures to protect it from unauthorized access, disclosure, alteration, and destruction. 
                            Our website is secured with SSL encryption to ensure the confidentiality of your data 
                            during transmission.
                        </p>
                        <p>
                            Despite our best efforts to secure your information, no method of transmission over 
                            the internet or electronic storage is 100% secure. Therefore, we cannot guarantee 
                            absolute security, but we continuously monitor and update our security measures to 
                            mitigate risks and safeguard your data.
                        </p>
                    </div>
                    <div className="policy-section p-4 mb-4 bg-light rounded">
                        <h5>Third-Party Services</h5>
                        <p>
                            We may engage third-party service providers to perform various functions on our behalf, 
                            such as order processing, payment processing, shipping, and marketing. These service 
                            providers have access to your personal information only to the extent necessary to 
                            perform their designated functions and are obligated to maintain the confidentiality 
                            and security of your data.
                        </p>
                        <p>
                            Additionally, our website may contain links to third-party websites or services that 
                            are not operated or controlled by us. We are not responsible for the privacy practices 
                            or content of these third-party websites and encourage you to review their privacy 
                            policies before providing any personal information.
                        </p>
                    </div>
                    <div className="policy-section p-4 mb-4 bg-light rounded">
                        <h5>Changes to Privacy Policy</h5>
                        <p>
                            We reserve the right to update or modify our privacy policy at any time, and any 
                            changes will be effective immediately upon posting on this page. We encourage you 
                            to review this privacy policy periodically for updates and changes.
                        </p>
                        <p>
                            By continuing to use our website after the posting of any changes to this privacy 
                            policy, you acknowledge and agree to the updated terms and practices outlined herein.
                        </p>
                    </div>
                    <div className="policy-section p-4 mb-4 bg-light rounded">
                        <h5>Contact Us</h5>
                        <p>
                            If you have any questions, concerns, or feedback regarding our privacy policy 
                            or practices, please contact us at <a href="mailto:support@example.com" className='text-info'>industryguruinfo@gmail.com</a>. 
                            We value your privacy and are committed to addressing any issues promptly and 
                            transparently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
