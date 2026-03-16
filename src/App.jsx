import { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  
  // Google Apps Script Web App URL
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbweSB2D93Ml09iYNKmYNsTNN4IGDd_ZRZ3At51H0Q9uLoupjoSdmIUoJMzekA02jz--/exec";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const GoldText = ({ children, className = "" }) => (
    <span className={`text-gold ${className}`}>{children}</span>
  );

  const Button = ({ variant = 'primary', children, onClick, className = "" }) => {
    const baseStyles = "px-8 py-4 transition-all duration-500 font-medium tracking-widest text-sm uppercase relative overflow-hidden group";
    const variants = {
      primary: "bg-gradient-to-r from-gold to-gold-hover text-black hover:from-gold-hover hover:to-gold hover:scale-105",
      secondary: "border-2 border-gold text-gold hover:bg-gold hover:text-black backdrop-blur-sm",
      text: "text-gold hover:text-gold-hover"
    };
    return (
      <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
        <span className="relative z-10">{children}</span>
        {variant === 'primary' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
      </button>
    );
  };

  const ApplicationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
      name: '',
      age: '',
      gender: '',
      education: '',
      profession: '',
      city: '',
      contactNumber: '',
      email: '',
      maritalStatus: '',
      eventInterest: '',
      agreeToTerms: false,
      agreeToPrivacy: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const validateStep = (step) => {
      if (step === 1) {
        return formData.name && formData.age && formData.gender && formData.maritalStatus;
      } else if (step === 2) {
        return formData.education && formData.profession && formData.city;
      } else if (step === 3) {
        return formData.contactNumber && formData.email && formData.eventInterest && formData.agreeToTerms && formData.agreeToPrivacy;
      }
      return false;
    };

    const handleNext = () => {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    };

    const handlePrev = () => {
      setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus({ type: '', message: '' });

      try {
        await fetch(googleScriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString()
          })
        });

        // Since mode is 'no-cors', we can't read the response
        // We'll assume success if no error is thrown
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! Our team will contact you within 24-48 hours for verification.'
        });
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            age: '',
            gender: '',
            education: '',
            profession: '',
            city: '',
            contactNumber: '',
            email: '',
            maritalStatus: '',
            eventInterest: '',
            agreeToTerms: false,
            agreeToPrivacy: false
          });
          setCurrentStep(1);
          setShowApplicationForm(false);
        }, 3000);

      } catch (error) {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to submit application. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!showApplicationForm) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-gradient-to-br from-matte-black to-deep-black border border-gold/30 rounded-lg max-w-sm w-full my-4 relative">
          {/* Close Button */}
          <button
            onClick={() => {
              setShowApplicationForm(false);
              setCurrentStep(1);
            }}
            className="absolute top-2 right-2 text-gold hover:text-gold-hover transition-colors z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-serif text-white mb-1">Apply For Invitation</h2>
            <p className="text-soft-grey text-xs mb-3">Step {currentStep} of 3</p>

            {submitStatus.message && (
              <div className={`mb-3 p-2 rounded border text-xs ${
                submitStatus.type === 'success' 
                  ? 'bg-green-900/20 border-green-500/50 text-green-400' 
                  : 'bg-red-900/20 border-red-500/50 text-red-400'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-soft-grey text-[10px] mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="Name"
                      />
                    </div>

                    <div>
                      <label className="block text-soft-grey text-[10px] mb-1">Age *</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="21"
                        max="60"
                        className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-soft-grey text-[10px] mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-soft-grey text-[10px] mb-1">Marital Status *</label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        required
                        className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Professional Info */}
              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-soft-grey text-[10px] mb-1">Education *</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      required
                      className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="e.g., MBA"
                    />
                  </div>

                  <div>
                    <label className="block text-soft-grey text-[10px] mb-1">Profession *</label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      required
                      className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="e.g., Doctor"
                    />
                  </div>

                  <div>
                    <label className="block text-soft-grey text-[10px] mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="City"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Contact & Event */}
              {currentStep === 3 && (
                <>
                  <div>
                    <label className="block text-soft-grey text-[10px] mb-1">Contact *</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="10-digit"
                    />
                  </div>

                  <div>
                    <label className="block text-soft-grey text-[10px] mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <label className="block text-soft-grey text-[10px] mb-1">Event Interest *</label>
                    <select
                      name="eventInterest"
                      value={formData.eventInterest}
                      onChange={handleChange}
                      required
                      className="w-full bg-deep-black border border-gold/20 rounded px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="">Select Event</option>
                      <option value="Elite Doctors Evening - Mumbai">Elite Doctors Evening - Mumbai</option>
                      <option value="Founders & Visionaries - Bangalore">Founders & Visionaries - Bangalore</option>
                      <option value="Any Upcoming Event">Any Upcoming Event</option>
                    </select>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                        className="mt-0.5 w-3 h-3 text-gold bg-deep-black border border-gold/20 rounded focus:ring-gold focus:ring-1"
                      />
                      <label className="text-[9px] text-soft-grey leading-tight">
                        I agree to the <button type="button" onClick={() => setShowTermsConditions(true)} className="text-gold hover:text-gold-hover underline">Terms & Conditions</button> *
                      </label>
                    </div>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onChange={handleChange}
                        required
                        className="mt-0.5 w-3 h-3 text-gold bg-deep-black border border-gold/20 rounded focus:ring-gold focus:ring-1"
                      />
                      <label className="text-[9px] text-soft-grey leading-tight">
                        I agree to the <button type="button" onClick={() => setShowPrivacyPolicy(true)} className="text-gold hover:text-gold-hover underline">Privacy Policy</button> *
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="pt-3 flex gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 bg-deep-black border border-gold/30 text-gold py-2 rounded font-medium tracking-widest text-xs uppercase hover:border-gold hover:bg-gold/5 transition-all duration-300"
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    className="flex-1 bg-gradient-to-r from-gold to-gold-hover text-black py-2 rounded font-medium tracking-widest text-xs uppercase hover:from-gold-hover hover:to-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !validateStep(currentStep)}
                    className="flex-1 bg-gradient-to-r from-gold to-gold-hover text-black py-2 rounded font-medium tracking-widest text-xs uppercase hover:from-gold-hover hover:to-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>

              <p className="text-[9px] text-soft-grey text-center mt-2">
                Our team will contact you within 24-48 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const PrivacyPolicyModal = () => {
    if (!showPrivacyPolicy) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-gradient-to-br from-matte-black to-deep-black border border-gold/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={() => setShowPrivacyPolicy(false)}
            className="absolute top-4 right-4 text-gold hover:text-gold-hover transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="p-8">
            <h2 className="text-3xl font-serif text-gold mb-6">Privacy Policy</h2>
            <div className="text-soft-grey text-sm space-y-4 leading-relaxed">
              <p className="text-xs text-gold">Last Updated: 12-03-2026</p>
              
              <div>
                <h3 className="text-white font-medium mb-2">1. Information We Collect</h3>
                <p>We collect personal information including your name, age, contact details, education, profession, and partner preferences to provide personalized matchmaking services.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">2. How We Use Your Information</h3>
                <p>Your information is used for creating your matchmaking profile, understanding preferences, curating compatible matches, and organizing exclusive events.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">3. Data Confidentiality</h3>
                <p>We treat your data with strict confidentiality. Only authorized team members can access your information, and we never sell or rent your personal data to third parties.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">4. Your Privacy Rights</h3>
                <p>You have the right to request access to your stored information, update your profile, request deletion, or withdraw consent for certain data usage.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">5. Contact Us</h3>
                <p>For privacy-related questions, contact us at theonepercentmatchmaking@gmail.com or call 8552932723.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TermsConditionsModal = () => {
    if (!showTermsConditions) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-gradient-to-br from-matte-black to-deep-black border border-gold/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={() => setShowTermsConditions(false)}
            className="absolute top-4 right-4 text-gold hover:text-gold-hover transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="p-8">
            <h2 className="text-3xl font-serif text-gold mb-6">Terms & Conditions</h2>
            <div className="text-soft-grey text-sm space-y-4 leading-relaxed">
              <p className="text-xs text-gold">Last Updated: 12-03-2026</p>
              
              <div>
                <h3 className="text-white font-medium mb-2">1. Eligibility</h3>
                <p>Participation is limited to individuals 18+ years old who are legally eligible to marry and provide accurate information during the application process.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">2. Application Process</h3>
                <p>All guests must submit an application and undergo verification. Submission does not guarantee acceptance to an event.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">3. Guest Conduct</h3>
                <p>All guests must maintain respectful behavior and not harass other attendees, misrepresent information, or breach confidentiality.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">4. No Guarantee</h3>
                <p>We provide curated social introductions only. We do not guarantee romantic compatibility, relationships, or marriage.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">5. Contact Information</h3>
                <p>For questions regarding these terms, contact us at theonepercentmatchmaking@gmail.com.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Navbar = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-gradient-to-b from-black/98 to-black/95 backdrop-blur-2xl border-b border-[#D4AF37]/40 shadow-[0_8px_32px_rgba(212,175,55,0.15)]' : 'bg-gradient-to-b from-black/95 via-black/90 to-black/80 backdrop-blur-xl lg:from-black/40 lg:to-transparent lg:backdrop-blur-sm'}`}>
      {/* Luxury top accent line */}
      <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-opacity duration-700 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-2 lg:py-2 flex justify-between items-center relative">
        {/* Subtle glow effect behind navbar */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none"></div>
        
        <div 
          className="flex items-center cursor-pointer hover:scale-105 transition-all duration-500 relative z-10 group"
          onClick={() => setActivePage('home')}
        >
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="The 1% Matchmaking" 
              className="h-28 sm:h-32 md:h-36 lg:h-40 w-auto drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-500 z-30"
              style={{ marginTop: '-20px', marginBottom: '-20px' }}
            />
          </div>
          <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-all duration-500 mt-1 absolute -bottom-2 left-0"></div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden relative z-10 text-[#D4AF37] p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 text-[10px] tracking-[0.3em] text-gray-300 uppercase relative z-10">
          <button 
            onClick={() => setActivePage('events')} 
            className={`relative py-2 transition-all duration-500 group ${activePage === 'events' ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
          >
            <span className="relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">Events</span>
            <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-500 ${activePage === 'events' ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
          </button>
          
          <button 
            onClick={() => setActivePage('howItWorks')} 
            className={`relative py-2 transition-all duration-500 group ${activePage === 'howItWorks' ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
          >
            <span className="relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">How It Works</span>
            <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-500 ${activePage === 'howItWorks' ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
          </button>
          
          <button 
            onClick={() => setActivePage('about')} 
            className={`relative py-2 transition-all duration-500 group ${activePage === 'about' ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
          >
            <span className="relative z-10 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">About</span>
            <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-500 ${activePage === 'about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
          </button>
          
          <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent"></div>
          
          <Button 
            variant="secondary" 
            onClick={() => setShowApplicationForm(true)}
            className="px-6 xl:px-8 py-2 xl:py-3 text-[10px] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] border-[#D4AF37]/60 hover:border-[#D4AF37]"
          >
            Apply Now
          </Button>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-gradient-to-b from-black via-black to-black/95 backdrop-blur-2xl border-b border-[#D4AF37]/30 shadow-2xl transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <nav className="flex flex-col items-center py-6 space-y-6 text-xs tracking-[0.3em] text-gray-300 uppercase">
          <button 
            onClick={() => { setActivePage('events'); setMobileMenuOpen(false); }} 
            className={`transition-colors duration-300 ${activePage === 'events' ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
          >
            Events
          </button>
          <button 
            onClick={() => { setActivePage('howItWorks'); setMobileMenuOpen(false); }} 
            className={`transition-colors duration-300 ${activePage === 'howItWorks' ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
          >
            How It Works
          </button>
          <button 
            onClick={() => { setActivePage('about'); setMobileMenuOpen(false); }} 
            className={`transition-colors duration-300 ${activePage === 'about' ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
          >
            About
          </button>
          <Button 
            variant="secondary" 
            onClick={() => { setShowApplicationForm(true); setMobileMenuOpen(false); }}
            className="px-8 py-3 text-xs"
          >
            Apply Now
          </Button>
        </nav>
      </div>
      
      {/* Luxury bottom accent line */}
      <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent transition-opacity duration-700 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}></div>
    </header>
  );

  const Home = () => (
    <div className="animate-in fade-in duration-700 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center bg-matte-black overflow-hidden pt-40 md:pt-32">
        {/* Spotlight Image Overlay - Even Larger Size, Centered */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[95%] h-[100%]">
          <img 
            src="/spotlight.png" 
            alt="" 
            className="w-full h-full object-contain opacity-50"
          />
        </div>
        
        {/* Dark overlay to control brightness */}
        <div className="absolute inset-0 bg-matte-black/20"></div>
        
        {/* Additional dramatic lighting effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[600px] bg-gold/8 blur-[80px]"></div>
        
        {/* Luxury Grain Texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="mb-12 sm:mb-16 md:mb-20">
            <p className="text-gold tracking-[0.4em] sm:tracking-[0.5em] text-[10px] sm:text-xs animate-pulse drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] border border-gold/30 px-4 sm:px-6 py-2 rounded-full backdrop-blur-sm bg-gold/5 inline-block">
              BY INVITATION ONLY
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white mb-4 sm:mb-6 md:mb-8 tracking-tight leading-none drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] [text-shadow:_0_0_80px_rgb(212_175_55_/_20%)] text-center">
            Exclusive Matchmaking Events<br />for India's Top 1%
          </h1>
          <div className="h-[1px] w-20 sm:w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-4 sm:mb-6 md:mb-8"></div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-light mb-3 sm:mb-4 md:mb-6 tracking-wide drop-shadow-lg text-center">Only 25 Verified Men and 25 Verified Women Invited to Each Event</p>
          <p className="text-soft-grey mb-8 sm:mb-12 md:mb-16 tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase font-light text-center max-w-2xl">Entry strictly after screening & approval by our relationship panel</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button 
              variant="primary" 
              onClick={() => setActivePage('events')}
              className="shadow-2xl shadow-gold/30 hover:shadow-gold/50 hover:scale-105 w-full sm:w-auto text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-4"
            >
              Apply For Upcoming Event
            </Button>
          </div>
        </div>
      </section>

      {/* Credibility Strip */}
      <section className="bg-gradient-to-r from-black via-[#0a0a0a] to-black py-8 sm:py-12 md:py-16 border-y border-[#D4AF37]/40 shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1),inset_0_-1px_0_0_rgba(212,175,55,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <p className="text-[#D4AF37] text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em] font-light uppercase flex flex-wrap justify-center items-center gap-2 sm:gap-4 md:gap-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span className="hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all duration-300">Strict Verification</span>
            <span className="opacity-40 text-[#D4AF37]/60">◆</span>
            <span className="hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all duration-300">Balanced Ratio</span>
            <span className="opacity-40 text-[#D4AF37]/60">◆</span>
            <span className="hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all duration-300">Private Venue</span>
            <span className="opacity-40 text-[#D4AF37]/60">◆</span>
            <span className="hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all duration-300">Curated Guests</span>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-[#000000] via-[#0f0f0f] to-[#000000] py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 md:gap-20 xl:gap-24">
            {[
              { step: "01", title: "Submit Application", desc: "Fill out the form with your details. No payment required." },
              { step: "02", title: "Verification & Approval", desc: "Our team verifies credentials and approves qualified applicants." },
              { step: "03", title: "Payment & Attend Event", desc: "After approval, complete payment and attend the exclusive evening." }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -m-4 sm:-m-6 p-4 sm:p-6"></div>
                <span className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#D4AF37]/15 absolute -top-6 sm:-top-8 md:-top-10 -left-1 sm:-left-2 group-hover:text-[#D4AF37]/25 transition-colors duration-500 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">{item.step}</span>
                <h3 className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6 relative z-10 font-serif tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300">{item.title}</h3>
                <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mb-4 sm:mb-6 group-hover:w-16 sm:group-hover:w-24 transition-all duration-500"></div>
                <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 sm:mt-20 md:mt-24 text-center">
            <div className="inline-block border border-[#D4AF37]/20 px-6 sm:px-8 py-2 sm:py-3 rounded-full backdrop-blur-sm bg-[#D4AF37]/5">
              <p className="text-gray-500 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase italic">Approval is subject to verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-black py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 tracking-wide drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">Upcoming Matchmaking Events</h2>
            <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 xl:gap-16 max-w-6xl mx-auto">
            {[
              {
                title: "Elite Doctors Evening",
                location: "Mumbai",
                date: "March 15, 2026",
                venue: "5-Star Private Lounge",
                category: "MBBS / Specialists Only",
                seats: "12 / 50",
                seatsFilled: 38,
                totalSeats: 50
              },
              {
                title: "Founders & Visionaries",
                location: "Bangalore",
                date: "April 02, 2026",
                venue: "Private Members Club",
                category: "Tech Founders / Series A+",
                seats: "08 / 50",
                seatsFilled: 42,
                totalSeats: 50
              }
            ].map((event, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#0a0a0a] to-[#000000] border border-[#D4AF37]/30 p-12 hover:border-[#D4AF37] transition-all duration-700 group relative overflow-hidden shadow-2xl hover:shadow-[#D4AF37]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:via-[#D4AF37]/5 group-hover:to-transparent transition-all duration-700"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full group-hover:bg-[#D4AF37]/10 transition-all duration-700"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-2xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-lg">{event.title}</h4>
                      <p className="text-[#D4AF37] tracking-[0.3em] text-xs uppercase drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">{event.location}</p>
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/40 to-transparent mb-8"></div>
                  <div className="space-y-4 mb-12 text-gray-300 text-sm">
                    <div className="flex items-center gap-4 group/item hover:text-[#D4AF37] transition-colors duration-300">
                      <Calendar className="w-5 h-5 text-[#D4AF37]/70 group-hover/item:text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" /> 
                      <span className="tracking-wide">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-4 group/item hover:text-[#D4AF37] transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-[#D4AF37]/70 group-hover/item:text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" /> 
                      <span className="tracking-wide">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-4 group/item hover:text-[#D4AF37] transition-colors duration-300">
                      <ShieldCheck className="w-5 h-5 text-[#D4AF37]/70 group-hover/item:text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" /> 
                      <span className="tracking-wide">{event.category}</span>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-[#D4AF37]/20 text-center">
                    <p className="text-[10px] text-gray-500 italic mb-4">
                      {event.seatsFilled >= 40 ? '🔥 Filling Fast!' : event.seatsFilled >= 30 ? 'Limited Seats Available' : 'Seats Available'}
                    </p>
                    <Button 
                      variant="secondary" 
                      onClick={() => setShowApplicationForm(true)}
                      className="px-8 py-3 text-xs shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-105"
                    >
                      Apply For Invitation
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-gradient-to-b from-[#000000] via-[#050505] to-[#000000] py-12 sm:py-16 md:py-20 lg:py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_70%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/3 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-12">
            <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mb-12"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">
              An Evening Designed For<br />Meaningful Conversations
            </h2>
            <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mt-12"></div>
          </div>
          <div className="space-y-6 text-gray-300 font-light text-lg leading-relaxed tracking-wide mt-16">
            <p className="hover:text-white transition-colors duration-300">A curated matchmaking evening focused on compatibility in intellect, education, mindset, and stability for individuals serious about marriage.</p>
            <p className="text-[#D4AF37] text-xl mt-8 tracking-[0.2em]">Not speed dating. No swiping. No randomness.</p>
          </div>
        </div>
      </section>

      {/* Application Timeline */}
      <section className="bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#000000] py-12 sm:py-16 md:py-20 lg:py-24 border-t border-[#D4AF37]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-6 tracking-widest">Our Selection Process</h2>
            <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
          </div>
          <div className="relative space-y-16">
            {["Submit Application", "Verification Call", "Credential Approval", "Payment & Event Pass"].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative">
                  {/* Removed pulsing ring animations */}
                  
                  {/* Main circle */}
                  <div className="relative w-16 h-16 rounded-full border-2 border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] mb-6 bg-gradient-to-br from-black to-[#0a0a0a] shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-500 font-serif text-xl group-hover:scale-110 transform">
                    {idx + 1}
                  </div>
                </div>
                
                <h4 className="text-white font-serif text-xl mb-2 group-hover:text-[#D4AF37] transition-all duration-300">{step}</h4>
                
                {/* Static connecting line - no animation */}
                {idx !== 3 && (
                  <div className="relative mt-6 h-16 w-[2px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/60 via-[#D4AF37]/30 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <div className="inline-block border border-[#D4AF37]/20 px-10 py-4 rounded-full backdrop-blur-sm bg-gradient-to-r from-[#D4AF37]/3 to-transparent hover:border-[#D4AF37]/40 transition-all duration-500">
              <p className="text-gray-400 text-xs italic tracking-wide">
                Payment is only required after approval. No upfront fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#000000] py-12 sm:py-16 md:py-20 lg:py-24 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mb-16"></div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 tracking-tight leading-tight">
            Extraordinary Individuals Deserve <br />
            <GoldText className="drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">Extraordinary Matchmaking.</GoldText>
          </h2>
          <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mt-16 mb-16"></div>
          <Button 
            variant="primary" 
            onClick={() => setShowApplicationForm(true)}
            className="px-16 py-6 text-base shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 hover:scale-110"
          >
            Apply For Upcoming Event
          </Button>
        </div>
      </section>
    </div>
  );

  const About = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-24 pb-16 bg-black min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center mb-20 pt-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] relative z-10">
            Redefining Elite Introductions
          </h1>
          <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-8"></div>
          <p className="text-gray-400 text-lg font-light tracking-wide max-w-3xl mx-auto relative z-10">
            Where India's most accomplished individuals meet in settings that reflect their standards
          </p>
        </div>
        
        {/* Philosophy Section */}
        <div className="grid md:grid-cols-2 gap-12 xl:gap-16 mb-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -m-6 p-6"></div>
            <div className="relative z-10">
              <h2 className="text-[#D4AF37] tracking-[0.3em] uppercase text-xs mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Philosophy</h2>
              <h3 className="text-3xl font-serif text-white mb-8 leading-snug group-hover:text-[#D4AF37] transition-colors duration-300">Why We Exist</h3>
              <div className="h-[1px] w-20 bg-gradient-to-r from-[#D4AF37] to-transparent mb-8 group-hover:w-32 transition-all duration-500"></div>
              <p className="text-gray-400 font-light leading-relaxed text-lg mb-6">
                In a world of infinite swiping and digital masks, we believe in the power of physical presence. 
                The 1% was created to filter out the noise and bring together high-achievers in settings that reflect their standards.
              </p>
              <p className="text-gray-400 font-light leading-relaxed">
                No algorithms. No profiles. Just genuine human connection in an environment designed for meaningful conversations.
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -m-6 p-6"></div>
            <div className="relative z-10">
              <h2 className="text-[#D4AF37] tracking-[0.3em] uppercase text-xs mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">The Medium</h2>
              <h3 className="text-3xl font-serif text-white mb-8 leading-snug group-hover:text-[#D4AF37] transition-colors duration-300">Why Offline</h3>
              <div className="h-[1px] w-20 bg-gradient-to-r from-[#D4AF37] to-transparent mb-8 group-hover:w-32 transition-all duration-500"></div>
              <p className="text-gray-300 font-light leading-relaxed text-lg mb-6">
                Real chemistry happens in the nuances—a shared laugh over fine wine, a spark during a conversation. 
                No algorithm can replace the intuition of a face-to-face encounter.
              </p>
              <p className="text-gray-400 font-light leading-relaxed">
                Our curated evenings provide the perfect setting for authentic connections to flourish naturally.
              </p>
            </div>
          </div>
        </div>

        {/* Who It's For Section */}
        <div className="border-t border-[#D4AF37]/20 pt-20 mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/3 blur-[120px] rounded-full"></div>
          <h2 className="text-center text-[#D4AF37] tracking-[0.3em] uppercase text-xs mb-16 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Who It Is For</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 xl:gap-10 text-center relative z-10">
            {[
              { title: 'Doctors', desc: 'MBBS, Specialists, Surgeons' },
              { title: 'Founders', desc: 'Tech, Series A+, Entrepreneurs' },
              { title: 'Professionals', desc: 'CXOs, Senior Leadership' },
              { title: 'Accomplished', desc: 'High Achievers, Experts' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 md:p-10 border border-[#D4AF37]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] hover:border-[#D4AF37] transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:to-transparent transition-all duration-500"></div>
                <div className="relative z-10">
                  <p className="text-white font-serif text-lg md:text-xl lg:text-2xl mb-3 group-hover:text-[#D4AF37] transition-colors duration-300 break-words">{item.title}</p>
                  <div className="h-[1px] w-12 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mb-4 group-hover:w-20 transition-all duration-500"></div>
                  <p className="text-gray-400 text-xs tracking-wide break-words">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Standard Section */}
        <div className="bg-gradient-to-br from-[#0f0f0f] to-[#000000] p-12 md:p-16 lg:p-20 border border-[#D4AF37]/20 relative overflow-hidden shadow-2xl mt-12">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">The Standard</h2>
              <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {[
                { 
                  title: "Balanced Ratio", 
                  desc: "Ensuring an equal 25:25 environment for optimal networking and genuine connections." 
                },
                { 
                  title: "Verified Guests", 
                  desc: "Strict manual vetting of professional and personal credentials through private verification calls." 
                },
                { 
                  title: "Limited Seats", 
                  desc: "Intimate gatherings of 50 guests where every introduction matters and quality trumps quantity." 
                },
                { 
                  title: "Premium Venue", 
                  desc: "Exclusive access to the most sophisticated private lounges and members-only clubs." 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <CheckCircle2 className="w-7 h-7 text-[#D4AF37] shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h4 className="text-white font-serif text-xl mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">{item.title}</h4>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-8">Ready to Join?</h3>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              Applications are reviewed on a rolling basis. Secure your place at our next exclusive evening.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setShowApplicationForm(true)}
              className="px-16 py-6 text-base shadow-2xl shadow-[#D4AF37]/40 hover:shadow-[#D4AF37]/60 hover:scale-110"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-black border-t border-white/5 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 sm:gap-12 mb-12 sm:mb-16 text-center md:text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#D4AF37] mb-2 tracking-tighter">THE 1% MATCHMAKING</h3>
            <p className="text-gray-400 text-[10px] sm:text-xs tracking-widest uppercase font-light max-w-xs mx-auto md:mx-0">The 1% Matchmaking curates exclusive, invitation-only events where exceptional individuals meet to find a truly compatible life partner.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 text-[10px] sm:text-xs tracking-widest uppercase text-gray-400 w-full md:w-auto justify-center md:justify-end">
            <div className="flex flex-col gap-3 sm:gap-4 text-center md:text-left">
              <button onClick={() => setActivePage('events')} className="hover:text-[#D4AF37] transition-colors">Events</button>
              <button onClick={() => setActivePage('howItWorks')} className="hover:text-[#D4AF37] transition-colors">How It Works</button>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 text-center md:text-left">
              <button onClick={() => setActivePage('about')} className="hover:text-[#D4AF37] transition-colors">About</button>
              <button onClick={() => setShowApplicationForm(true)} className="hover:text-[#D4AF37] transition-colors">Apply</button>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 col-span-2 sm:col-span-1 text-center md:text-left">
              <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-[#D4AF37] transition-colors">Privacy Policy</button>
              <button onClick={() => setShowTermsConditions(true)} className="hover:text-[#D4AF37] transition-colors">Terms</button>
            </div>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center md:justify-between items-center text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-600 gap-4 text-center">
          <p>© 2026 THE 1% MATCHMAKING. ALL RIGHTS RESERVED.</p>
          <p>MADE FOR THE EXTRAORDINARY</p>
        </div>
      </div>
    </footer>
  );

  const HowItWorks = () => (
    <div className="animate-in fade-in duration-700 pt-24 pb-16 bg-black min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center mb-20 pt-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-wide drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] relative z-10">
            How It Works
          </h1>
          <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-8"></div>
          <p className="text-gray-400 text-lg font-light tracking-wide max-w-3xl mx-auto relative z-10">
            A seamless journey from application to your exclusive evening
          </p>
        </div>

        {/* Step-by-Step Process */}
        <div className="space-y-16 mb-20">
          {[
            {
              step: "01",
              title: "Browse Events",
              desc: "Explore our upcoming curated evenings tailored for specific professional communities.",
              details: [
                "View event details including date, venue, and guest criteria",
                "Each event is limited to 50 verified guests (25:25 ratio)",
                "Events are held at premium 5-star venues and private members clubs"
              ]
            },
            {
              step: "02",
              title: "Submit Application",
              desc: "Fill out the simple application form with your details.",
              details: [
                "Provide basic information (name, email, phone number)",
                "Share professional details (education, profession, city)",
                "Select your event of interest",
                "Receive instant confirmation email"
              ]
            },
            {
              step: "03",
              title: "Verification Call",
              desc: "Our relationship manager will contact you within 24-48 hours for credential verification.",
              details: [
                "Brief 10-15 minute phone conversation",
                "Verification of professional credentials and background",
                "Discussion about your expectations from the event",
                "Answer any questions you may have"
              ]
            },
            {
              step: "04",
              title: "Approval & Payment",
              desc: "Once approved, you'll receive a payment link to confirm your seat.",
              details: [
                "Approval notification via email within 48 hours",
                "Secure payment link sent after approval",
                "Complete payment to reserve your seat",
                "In case of non-approval, no payment required"
              ]
            },
            {
              step: "05",
              title: "Attend The Evening",
              desc: "Arrive at the exclusive venue and experience meaningful connections.",
              details: [
                "Receive digital event pass with QR code",
                "Check-in at the venue",
                "Welcome drink and networking session",
                "Structured introductions facilitated by our team",
                "Fine dining experience with curated seating",
                "Private one-on-one interaction opportunities"
              ]
            }
          ].map((item, idx) => (
            <div key={idx} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: `${idx * 100}ms`}}>
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#D4AF37]/10 blur-xl rounded-full group-hover:bg-[#D4AF37]/20 transition-all duration-500"></div>
                    <div className="relative w-24 h-24 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-gradient-to-br from-black to-[#0a0a0a] shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all duration-500 group-hover:scale-110">
                      <span className="text-4xl font-serif text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">{item.step}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <div className="h-[1px] w-20 bg-gradient-to-r from-[#D4AF37] to-transparent mb-6 group-hover:w-32 transition-all duration-500"></div>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {item.desc}
                  </p>
                  <ul className="space-y-3">
                    {item.details.map((detail, detailIdx) => (
                      <li key={detailIdx} className="flex items-start gap-3 text-gray-400 group/item hover:text-[#D4AF37] transition-colors duration-300">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                        <span className="text-sm leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Connecting Line */}
              {idx !== 4 && (
                <div className="hidden md:block absolute left-12 top-24 w-[2px] h-24 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        {/* What to Expect Section */}
        <div className="bg-gradient-to-br from-[#0f0f0f] to-[#000000] p-16 md:p-20 border border-[#D4AF37]/20 relative overflow-hidden shadow-2xl mb-32">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">What to Expect</h2>
              <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {[
                { 
                  title: "Curated Guest List", 
                  desc: "Every attendee is manually verified to ensure you're meeting accomplished individuals from your professional community." 
                },
                { 
                  title: "Structured Networking", 
                  desc: "Our team facilitates introductions and ensures everyone has meaningful conversations throughout the evening." 
                },
                { 
                  title: "Premium Experience", 
                  desc: "Fine dining, elegant ambiance, and attention to detail that reflects the standards of our guests." 
                },
                { 
                  title: "Privacy & Discretion", 
                  desc: "What happens at our events stays private. We maintain strict confidentiality for all attendees." 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <CheckCircle2 className="w-7 h-7 text-[#D4AF37] shrink-0 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h4 className="text-white font-serif text-xl mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">{item.title}</h4>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-white mb-6">Frequently Asked Questions</h2>
            <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                q: "What happens if I'm not approved?",
                a: "If your application doesn't meet our criteria, you'll receive a full refund within 48 hours. No questions asked."
              },
              {
                q: "Can I bring a plus one?",
                a: "Each guest must apply individually and go through the verification process. This ensures everyone meets our standards."
              },
              {
                q: "What is the dress code?",
                a: "Smart formal attire. Think business formal or cocktail attire. Detailed guidelines are sent with your event pass."
              },
              {
                q: "How long does the event last?",
                a: "Typically 3-4 hours, including welcome drinks, dinner, and structured networking sessions."
              },
              {
                q: "Is my information kept confidential?",
                a: "Absolutely. We maintain strict privacy and never share attendee information without explicit consent."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#0a0a0a] to-[#000000] border border-[#D4AF37]/20 p-8 hover:border-[#D4AF37]/40 transition-all duration-500 group">
                <h4 className="text-white font-serif text-lg mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">{item.q}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-8">Ready to Begin?</h3>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              Browse our upcoming events and reserve your seat at the next exclusive evening.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="primary" 
                onClick={() => setActivePage('events')}
                className="px-16 py-6 text-base shadow-2xl shadow-[#D4AF37]/40 hover:shadow-[#D4AF37]/60 hover:scale-110"
              >
                View Events
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowApplicationForm(true)}
                className="px-16 py-6 text-base shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/40"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Events = () => (
    <div className="animate-in fade-in duration-700 pt-24 pb-16 bg-black min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-wide drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">Upcoming Matchmaking Events</h1>
          <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-8"></div>
          <p className="text-gray-400 text-lg font-light tracking-wide max-w-2xl mx-auto">
            Intimate gatherings designed for meaningful connections among India's most accomplished individuals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "Elite Doctors Evening",
              location: "Mumbai",
              date: "March 15, 2026",
              venue: "5-Star Private Lounge",
              category: "MBBS / Specialists Only",
              seats: "12 / 50",
              seatsFilled: 38,
              totalSeats: 50
            },
            {
              title: "Founders & Visionaries",
              location: "Bangalore",
              date: "April 02, 2026",
              venue: "Private Members Club",
              category: "Tech Founders / Series A+",
              seats: "08 / 50",
              seatsFilled: 42,
              totalSeats: 50
            }
          ].map((event, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#0a0a0a] to-[#000000] border border-[#D4AF37]/30 p-12 hover:border-[#D4AF37] transition-all duration-700 group relative overflow-hidden shadow-2xl hover:shadow-[#D4AF37]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:via-[#D4AF37]/5 group-hover:to-transparent transition-all duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full group-hover:bg-[#D4AF37]/10 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-3xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-lg">{event.title}</h4>
                    <p className="text-[#D4AF37] tracking-[0.3em] text-xs uppercase drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">{event.location}</p>
                  </div>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/40 to-transparent mb-8"></div>
                <div className="space-y-4 mb-12 text-gray-300 text-sm">
                  <div className="flex items-center gap-4 group/item hover:text-[#D4AF37] transition-colors duration-300">
                    <Calendar className="w-5 h-5 text-[#D4AF37]/70 group-hover/item:text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" /> 
                    <span className="tracking-wide">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-4 group/item hover:text-[#D4AF37] transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-[#D4AF37]/70 group-hover/item:text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" /> 
                    <span className="tracking-wide">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-4 group/item hover:text-[#D4AF37] transition-colors duration-300">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]/70 group-hover/item:text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" /> 
                    <span className="tracking-wide">{event.category}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-[#D4AF37]/20">
                  <div className="flex-1 text-center">
                    <p className="text-[10px] text-gray-500 italic mb-4">
                      {event.seatsFilled >= 40 ? '🔥 Filling Fast!' : event.seatsFilled >= 30 ? 'Limited Seats Available' : 'Seats Available'}
                    </p>
                    <Button 
                      variant="secondary" 
                      onClick={() => setShowApplicationForm(true)}
                      className="px-8 py-3 text-xs shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-105"
                    >
                      Apply For Invitation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black font-sans overflow-x-hidden">
      <Navbar />
      <ApplicationForm />
      <PrivacyPolicyModal />
      <TermsConditionsModal />
      {activePage === 'home' ? <Home /> : activePage === 'events' ? <Events /> : activePage === 'howItWorks' ? <HowItWorks /> : <About />}
      <Footer />
    </div>
  );
};

export default App;
