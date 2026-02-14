'use client';

import LandingLayout from '@/components/layout/LandingLayout';

export default function PrivacyPolicyPage() {
    return (
        <LandingLayout>
            <div className="min-h-screen bg-background py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
                        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                        <p className="lead text-xl text-muted-foreground mb-12">
                            Last updated: February 9, 2026
                        </p>

                        <section className="mb-12">
                            <h2>1. Introduction</h2>
                            <p>
                                Women in Film & TV Africa ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our member services.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>2. Information We Collect</h2>
                            <p>
                                We collect information that you voluntarily provide to us when you register for the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
                            </p>
                            <ul>
                                <li><strong>Personal Data:</strong> Name, email address, phone number, and professional details.</li>
                                <li><strong>Profile Data:</strong> Biography, profile photo, and social media links.</li>
                                <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>3. How We Use Your Information</h2>
                            <p>
                                We use the information we collect or receive:
                            </p>
                            <ul>
                                <li>To facilitating account creation and logon process.</li>
                                <li>To post testimonials.</li>
                                <li>To request feedback.</li>
                                <li>To enable user-to-user communications.</li>
                                <li>To manage user accounts.</li>
                                <li>To send administrative information to you.</li>
                                <li>To protect our Services.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>4. Disclosure of Your Information</h2>
                            <p>
                                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                            </p>
                            <ul>
                                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>5. Security of Your Information</h2>
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>6. Contact Us</h2>
                            <p>
                                If you have questions or comments about this policy, you may contact us at:
                            </p>
                            <p>
                                <strong>Women in Film & TV Africa</strong><br />
                                Email: <a href="mailto:support@wiftafrica.org" className="text-primary hover:underline">support@wiftafrica.org</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
