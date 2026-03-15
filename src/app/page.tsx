"use client";

import Head from 'next/head';
import { useState } from 'react';
import { FiUpload, FiDownload, FiZap, FiStar, FiCheck, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('hero');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      setFile(target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      originalTokens: 150000,
      compactedTokens: 45000,
      compressionRatio: 0.70,
      preservedItems: 12,
      compactedItems: 50
    });
    
    setIsProcessing(false);
  };

  const handleDownload = () => {
    // Simulate download
    const blob = new Blob(['Optimized context content...'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-context.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>ContextKeep - AI Token Compaction</title>
        <meta name="description" content="Optimize AI context by compacting tokens while preserving high-value content" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FiZap className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">ContextKeep</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setActiveTab('hero')} className={`px-3 py-2 text-sm font-medium ${activeTab === 'hero' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Home</button>
              <button onClick={() => setActiveTab('features')} className={`px-3 py-2 text-sm font-medium ${activeTab === 'features' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Features</button>
              <button onClick={() => setActiveTab('pricing')} className={`px-3 py-2 text-sm font-medium ${activeTab === 'pricing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Pricing</button>
              <button onClick={() => setActiveTab('demo')} className={`px-3 py-2 text-sm font-medium ${activeTab === 'demo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Demo</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        {activeTab === 'hero' && (
          <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                AI Token Compaction
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                Optimize your AI context by intelligently compacting tokens while preserving high-value content
              </p>
              <div className="mt-10 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Try Free Demo
                  </button>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {activeTab === 'features' && (
          <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Powerful Token Compaction Features
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Everything you need to optimize AI context efficiently
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                        <FiUpload className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Upload Context</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Upload your AI context files in JSON format. Supports various AI framework outputs.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                        <FiZap className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Compress Tokens</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Intelligently compact low-value content while preserving decisions, blockers, and active tasks.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white">
                        <FiDownload className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Download Optimized</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get your optimized context with reduced token count and preserved high-value content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How It Works Section */}
        {activeTab === 'features' && (
          <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  How Token Compaction Works
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Our 3-step intelligent compaction process
                </p>
              </div>

              <div className="mt-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white font-bold">
                      1
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">Context Analysis</h3>
                    <p className="mt-4 text-base text-gray-500">
                      We analyze your AI context to identify high-value and low-value content using our hybrid scoring system.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white font-bold">
                      2
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">Intelligent Compaction</h3>
                    <p className="mt-4 text-base text-gray-500">
                      Based on token thresholds, we apply progressive compaction strategies to reduce token count.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white font-bold">
                      3
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">Preservation & Optimization</h3>
                    <p className="mt-4 text-base text-gray-500">
                      Critical content like decisions and blockers are always preserved while low-value content is compacted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section */}
        {activeTab === 'pricing' && (
          <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Choose the plan that fits your needs
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                {/* Free Tier */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-lg font-medium text-gray-900">Free Tier</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">$0</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <p className="mt-6 text-base text-gray-500">
                    Perfect for developers and small projects getting started with token compaction.
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">Up to 10 compactions/month</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">Basic compaction features</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">Email support</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <button className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-6 text-center text-white font-medium hover:bg-blue-700">
                      Get Started Free
                    </button>
                  </div>
                </div>

                {/* Pro Tier */}
                <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600">
                  <h3 className="text-lg font-medium text-gray-900">Pro Tier</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">$49</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <p className="mt-6 text-base text-gray-500">
                    For professional developers and teams who need advanced token optimization.
                  </p>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">Unlimited compactions</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">Advanced compaction algorithms</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">Priority support</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">API access</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">Team collaboration features</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <button className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-6 text-center text-white font-medium hover:bg-blue-700">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Demo Section */}
        {activeTab === 'demo' && (
          <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Interactive Token Compaction Demo
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Try our compaction algorithm with your own context
                </p>
              </div>

              <div className="mt-16 max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Context File (JSON)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".json" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">JSON files up to 10MB</p>
                        {file && (
                          <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <button
                      onClick={handleProcess}
                      disabled={!file || isProcessing}
                      className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${!file || isProcessing ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Compress Tokens</>
                      )}
                    </button>
                  </div>

                  {result && (
                    <div className="bg-white rounded-lg p-6 border border-green-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Compaction Results</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Original Tokens</p>
                          <p className="text-2xl font-bold text-gray-900">{result.originalTokens.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Compacted Tokens</p>
                          <p className="text-2xl font-bold text-green-600">{result.compactedTokens.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Compression Ratio</p>
                          <p className="text-2xl font-bold text-blue-600">{(result.compressionRatio * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Items Preserved</p>
                          <p className="text-2xl font-bold text-gray-900">{result.preservedItems}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={handleDownload}
                          className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          <FiDownload className="mr-2" />
                          Download Optimized Context
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* How It Works Visual */}
              <div className="mt-16">
                <h3 className="text-xl font-medium text-gray-900 mb-6">Compaction Process</h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUpload className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-700">Upload</span>
                  </div>
                  <FiArrowRight className="h-6 w-6 text-gray-400" />
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiZap className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-700">Compress</span>
                  </div>
                  <FiArrowRight className="h-6 w-6 text-gray-400" />
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiDownload className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-700">Download</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} ContextKeep. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}