'use client';

import LandingLayout from '@/components/layout/LandingLayout';

export default function TermsOfServicePage() {
    return (
        <LandingLayout>
            <div className="min-h-screen bg-background py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
                        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                        <p className="lead text-xl text-muted-foreground mb-12">
                            Last updated: February 9, 2026
                        </p>

                        <section className="mb-12">
                            <h2>1. Agreement to Terms</h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement between you, whether personally or on behalf of an entity ("you") and Women in Film & TV Africa ("we," "us," or "our"), concerning your access to and use of the WIFT Africa website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>2. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>3. User Representations</h2>
                            <p>
                                By using the Site, you represent and warrant that:
                            </p>
                            <ul>
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You are not a minor in the jurisdiction in which you reside.</li>
                                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>4. User Registration</h2>
                            <p>
                                You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>5. Prohibited Activities</h2>
                            <p>
                                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>6. Modifications and Interruptions</h2>
                            <p>
                                We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>7. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and defined following the laws of [Country/Region]. WIFT Africa and yourself irrevocably consent that the courts of [Country/Region] shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2>8. Contact Us</h2>
                            <p>
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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
