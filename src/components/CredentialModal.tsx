import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import { useCredentials } from "../hooks/useCredentials";
import { useTheme, type Theme } from "../hooks/useTheme";
import type { ModalProps } from "../types";

interface CredentialModalProps extends ModalProps {
  userId: string;
  onSuccess: () => void;
}

export default function CredentialModal({ setShowModal, userId, onSuccess }: CredentialModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const currentTheme = (localStorage.getItem('skillpassport-theme') as Theme) || 'theme1';
  const theme = useTheme(currentTheme);
  const { addCredential, uploadCertificate } = useCredentials(userId);

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    issuer: "",
    issue_date: "",
    evidence_url: ""
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const credentialTypes = [
    "Certificate",
    "Diploma", 
    "Badge",
    "Other"
  ];

  const popularIssuers = ["Google", "Microsoft", "AWS", "Meta", "Coursera", "Udemy"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a PDF file only' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File must be less than 10MB' });
      return;
    }

    setSelectedFile(file);
    setMessage({ type: 'success', text: `Selected: ${file.name}` });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      let evidenceUrl = '';
      
      // Upload file if selected
      if (selectedFile) {
        evidenceUrl = await uploadCertificate(selectedFile);
      }

      // Create credential
      await addCredential({
        type: formData.type,
        name: formData.name,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        evidence_url: evidenceUrl
      });

      setMessage({ type: 'success', text: 'Credential added successfully!' });
      setTimeout(() => {
        onSuccess();
        setShowModal(false);
      }, 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1: return formData.type;
      case 2: return formData.name && formData.issuer;
      case 3: return formData.issue_date;
      case 4: return true; // Basic info review
      case 5: return true; // Evidence review
      case 6: return true; // PDF upload (optional)
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div 
        className={`${theme.card} p-8 rounded-2xl w-full max-w-2xl text-white border ${theme.border} max-h-[90vh] overflow-y-auto`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Credential</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                num <= step ? `bg-gradient-to-r ${theme.button} text-white` : 'bg-gray-600 text-gray-300'
              }`}>
                {num}
              </div>
              {num < 6 && <div className={`w-8 h-0.5 transition-colors ${num < step ? `bg-gradient-to-r ${theme.button}` : 'bg-gray-600'}`} />}
            </div>
          ))}
        </div>

        {/* Message Display */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === 'error' 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Step 1: Credential Type */}
        {step === 1 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Choose Credential Type</h3>
            <div className="space-y-3">
              {credentialTypes.map((type, i) => (
                <div 
                  key={i} 
                  onClick={() => handleInputChange('type', type)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    formData.type === type 
                      ? `bg-gradient-to-r ${theme.button} border-blue-400` 
                      : `${theme.card} ${theme.cardHover} border-gray-600`
                  }`}
                >
                  <div className="font-medium">{type}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button 
                onClick={nextStep} 
                disabled={!validateStep()}
                className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
            <div className="space-y-4">
              <input 
                className={`w-full p-3 rounded-lg ${theme.card} border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors`}
                placeholder="Credential Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <input 
                className={`w-full p-3 rounded-lg ${theme.card} border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors`}
                placeholder="Issuer Organization"
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                {popularIssuers.map((issuer, i) => (
                  <button
                    key={i}
                    onClick={() => handleInputChange('issuer', issuer)}
                    className={`p-3 rounded-lg border transition-colors ${
                      formData.issuer === issuer
                        ? `bg-gradient-to-r ${theme.button} border-blue-400`
                        : `${theme.card} border-gray-600 ${theme.cardHover}`
                    }`}
                  >
                    {issuer}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!validateStep()}
                className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Issue Date */}
        {step === 3 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Issue Date</h3>
            <div className="space-y-4">
              <input 
                type="date"
                className={`w-full p-3 rounded-lg ${theme.card} border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors`}
                value={formData.issue_date}
                onChange={(e) => handleInputChange('issue_date', e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!validateStep()}
                className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review Basic Info */}
        {step === 4 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Review Information</h3>
            <div className={`${theme.card} p-6 rounded-xl border border-gray-600 space-y-3`}>
              <div><span className={`font-semibold ${theme.accent}`}>Type:</span> {formData.type}</div>
              <div><span className={`font-semibold ${theme.accent}`}>Name:</span> {formData.name}</div>
              <div><span className={`font-semibold ${theme.accent}`}>Issuer:</span> {formData.issuer}</div>
              <div><span className={`font-semibold ${theme.accent}`}>Issue Date:</span> {formData.issue_date}</div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={nextStep}
                className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} px-6 py-3 rounded-lg font-medium transition-all`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Evidence Links */}
        {step === 5 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Evidence Links (Optional)</h3>
            <div className="space-y-4">
              <textarea 
                className={`w-full p-3 rounded-lg ${theme.card} border border-gray-600 focus:border-blue-500 focus:outline-none h-24 resize-none transition-colors`}
                placeholder="Add any relevant links or additional information..."
                value={formData.evidence_url}
                onChange={(e) => handleInputChange('evidence_url', e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={nextStep}
                className={`bg-gradient-to-r ${theme.button} ${theme.buttonHover} px-6 py-3 rounded-lg font-medium transition-all`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 6: PDF Upload */}
        {step === 6 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Upload Certificate (Optional)</h3>
            
            <div className="space-y-6">
              {/* File Upload Area */}
              <div className={`border-2 border-dashed border-gray-600 rounded-xl p-8 text-center ${theme.cardHover} transition-colors`}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-4">
                    {selectedFile ? (
                      <>
                        <FileText className="w-16 h-16 text-green-400" />
                        <div>
                          <p className="text-lg font-medium text-green-400">{selectedFile.name}</p>
                          <p className="text-sm text-gray-400">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-16 h-16 text-gray-400" />
                        <div>
                          <p className="text-lg font-medium">Upload PDF Certificate</p>
                          <p className="text-sm text-gray-400">Click to select or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-2">PDF files only, max 10MB</p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setMessage({ type: '', text: '' });
                    }}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Credential</span>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}