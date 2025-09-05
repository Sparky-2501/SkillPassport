import { useState } from "react";
import type { ModalProps } from "../types";

export default function CredentialModal({ setShowModal }: ModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    expiryDate: "",
    issuer: "",
    customIssuer: "",
    issuerAddress: "",
    skills: "",
    evidenceLinks: ""
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const credentialTypes = [
    "Professional Certification",
    "Technical Skill", 
    "Project Work",
    "Work Experience",
    "Educational Achievement"
  ];

  const popularIssuers = ["Google", "Microsoft", "AWS", "Meta"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Here you would typically save the credential
    console.log("Submitting credential:", formData);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1c1f40] p-8 rounded-2xl w-full max-w-2xl text-white border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                num <= step ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {num}
              </div>
              {num < 5 && <div className={`w-8 h-0.5 ${num < step ? 'bg-blue-600' : 'bg-gray-600'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Credential Type</h2>
            <div className="space-y-3">
              {credentialTypes.map((type, i) => (
                <div 
                  key={i} 
                  onClick={() => handleInputChange('type', type)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.type === type 
                      ? 'bg-blue-600 border-blue-400' 
                      : 'bg-[#11152e] hover:bg-[#2a2d55] border-transparent'
                  } border`}
                >
                  <div className="font-medium">{type}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button 
                onClick={nextStep} 
                disabled={!formData.type}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-4">
              <input 
                className="w-full p-3 rounded-lg bg-[#11152e] border border-gray-600 focus:border-blue-500 focus:outline-none" 
                placeholder="Credential Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              <textarea 
                className="w-full p-3 rounded-lg bg-[#11152e] border border-gray-600 focus:border-blue-500 focus:outline-none h-24 resize-none" 
                placeholder="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              <input 
                type="date"
                className="w-full p-3 rounded-lg bg-[#11152e] border border-gray-600 focus:border-blue-500 focus:outline-none" 
                placeholder="Expiry Date (Optional)"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!formData.title || !formData.description}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Issuer</h2>
            <div className="space-y-3 mb-6">
              {popularIssuers.map((issuer, i) => (
                <div 
                  key={i} 
                  onClick={() => handleInputChange('issuer', issuer)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.issuer === issuer 
                      ? 'bg-blue-600 border-blue-400' 
                      : 'bg-[#11152e] hover:bg-[#2a2d55] border-transparent'
                  } border`}
                >
                  <div className="font-medium">{issuer}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-600 pt-6">
              <h3 className="font-semibold mb-4">Or add custom issuer:</h3>
              <div className="space-y-4">
                <input 
                  className="w-full p-3 rounded-lg bg-[#11152e] border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  placeholder="Custom Issuer Name"
                  value={formData.customIssuer}
                  onChange={(e) => handleInputChange('customIssuer', e.target.value)}
                />
                <input 
                  className="w-full p-3 rounded-lg bg-[#11152e] border border-gray-600 focus:border-blue-500 focus:outline-none" 
                  placeholder="Issuer Address (0x...)"
                  value={formData.issuerAddress}
                  onChange={(e) => handleInputChange('issuerAddress', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!formData.issuer && !formData.customIssuer}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Evidence & Skills</h2>
            <div className="space-y-4">
              <input 
                className="w-full p-3 rounded-lg bg-[#11152e] border border-gray-600 focus:border-blue-500 focus:outline-none" 
                placeholder="Related Skills (comma separated)"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
              />
              <textarea 
                className="w-full p-3 rounded-lg bg-[#11152e] border border-gray-600 focus:border-blue-500 focus:outline-none h-24 resize-none" 
                placeholder="Evidence Links (Optional - one per line)"
                value={formData.evidenceLinks}
                onChange={(e) => handleInputChange('evidenceLinks', e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>
            <div className="bg-[#11152e] p-6 rounded-xl border border-gray-600 space-y-3">
              <div><span className="font-semibold text-blue-400">Title:</span> {formData.title || "Not specified"}</div>
              <div><span className="font-semibold text-blue-400">Type:</span> {formData.type || "Not specified"}</div>
              <div><span className="font-semibold text-blue-400">Issuer:</span> {formData.issuer || formData.customIssuer || "Not specified"}</div>
              <div><span className="font-semibold text-blue-400">Skills:</span> {formData.skills ? formData.skills.split(',').length : 0} skills</div>
              <div><span className="font-semibold text-blue-400">Evidence:</span> {formData.evidenceLinks ? formData.evidenceLinks.split('\n').filter(link => link.trim()).length : 0} links</div>
              {formData.expiryDate && <div><span className="font-semibold text-blue-400">Expires:</span> {formData.expiryDate}</div>}
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Submit Credential
              </button>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}