import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const DoubleAngleIdentity = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(30);
  const [selectedIdentity, setSelectedIdentity] = useState('sine');
  const [selectedExample, setSelectedExample] = useState('sine');
  const [hasError, setHasError] = useState(false);
  const [cosineVariant, setCosineVariant] = useState('both');
  const [stepAnswers, setStepAnswers] = useState({
    step1: '',
    step2: ''
  });
  const [stepStatus, setStepStatus] = useState({
    step1: false,
    step2: false
  });
  const [step2Error, setStep2Error] = useState(false);

  const calculateAnswer = (angle, identity) => {
    const rad = angle * Math.PI / 180;
    switch (identity) {
      case 'sine':
        return (2 * Math.sin(rad) * Math.cos(rad)).toFixed(3);
      case 'cosine': {
        if (cosineVariant === 'onlyCos') {
          const cosVal = Math.cos(rad);
          return (2 * cosVal * cosVal - 1).toFixed(3);
        } else if (cosineVariant === 'onlySin') {
          const sinVal = Math.sin(rad);
          return (1 - 2 * sinVal * sinVal).toFixed(3);
        } else {
          return (Math.cos(rad) * Math.cos(rad) - Math.sin(rad) * Math.sin(rad)).toFixed(3);
        }}
      case 'tangent':
        return ((2 * Math.tan(rad)) / (1 - Math.tan(rad) * Math.tan(rad))).toFixed(3);
      default:
        return 0;
    }
  };

  const checkAnswer = () => {
    const correctAnswer = calculateAnswer(currentAngle, selectedIdentity);
    const userNumeric = parseFloat(userAnswer).toFixed(3);
    
    setHasError(userNumeric !== correctAnswer);
    if (userNumeric === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('');
    }
  };

  const generateNewProblem = () => {
    const angles = [30, 45, 60];
    const identities = ['sine', 'cosine', 'tangent'];
    const newAngle = angles[Math.floor(Math.random() * angles.length)];
    const newIdentity = identities[Math.floor(Math.random() * identities.length)];
    const variants = ['both', 'onlyCos', 'onlySin'];
    
    if (newIdentity === 'cosine') {
      const newVariant = variants[Math.floor(Math.random() * variants.length)];
      setCosineVariant(newVariant);
    }
    
    setCurrentAngle(newAngle);
    setSelectedIdentity(newIdentity);
    setUserAnswer('');
    setFeedback('');
    setShowSteps(false);
    setHasError(false);
    setStepStatus({ step1: false, step2: false });
    setStepAnswers({ step1: '', step2: '' });
  };

  const checkStepOne = () => {
    setStepStatus(prev => ({ ...prev, step1: true }));
  };

  const validateStep2Answer = (input) => {
    const angle = currentAngle / 2;
    const rad = angle * Math.PI / 180;
    
    // Remove all spaces and convert to lowercase for comparison
    const cleanInput = input.replace(/\s+/g, '').toLowerCase();
    
    switch (selectedIdentity) {
      case 'sine': {
        const correctAnswer = `2(${Math.sin(rad).toFixed(3)})(${Math.cos(rad).toFixed(3)})`;
        const altAnswer = `2*${Math.sin(rad).toFixed(3)}*${Math.cos(rad).toFixed(3)}`;
        return cleanInput === correctAnswer.replace(/\s+/g, '') || 
               cleanInput === altAnswer.replace(/\s+/g, '');
      }
      case 'cosine': {
        if (cosineVariant === 'onlyCos') {
          const cosVal = Math.cos(rad).toFixed(3);
          const correctAnswer = `2(${cosVal})^2-1`;
          const altAnswer = `2*${cosVal}^2-1`;
          return cleanInput === correctAnswer.replace(/\s+/g, '') || 
                 cleanInput === altAnswer.replace(/\s+/g, '');
        } else if (cosineVariant === 'onlySin') {
          const sinVal = Math.sin(rad).toFixed(3);
          const correctAnswer = `1-2(${sinVal})^2`;
          const altAnswer = `1-2*${sinVal}^2`;
          return cleanInput === correctAnswer.replace(/\s+/g, '') || 
                 cleanInput === altAnswer.replace(/\s+/g, '');
        } else {
          const cosVal = Math.cos(rad).toFixed(3);
          const sinVal = Math.sin(rad).toFixed(3);
          const correctAnswer = `(${cosVal})^2-(${sinVal})^2`;
          const altAnswer = `${cosVal}^2-${sinVal}^2`;
          return cleanInput === correctAnswer.replace(/\s+/g, '') || 
                 cleanInput === altAnswer.replace(/\s+/g, '');
        }
      }
      case 'tangent': {
        const tanVal = calculateAnswer(angle, 'tangent');
        const correctAnswer = `2(${tanVal})/(1-(${tanVal})^2)`;
        const altAnswer = `2*${tanVal}/(1-${tanVal}^2)`;
        return cleanInput === correctAnswer.replace(/\s+/g, '') || 
               cleanInput === altAnswer.replace(/\s+/g, '');
      }
      default:
        return false;
    }
  };

  const checkStepTwo = () => {
    if (!stepAnswers.step2.trim()) {
      setStep2Error(true);
      return;
    }

    const isCorrect = validateStep2Answer(stepAnswers.step2);
    if (isCorrect) {
      setStepStatus(prev => ({ ...prev, step2: true }));
      setStep2Error(false);
    } else {
      setStep2Error(true);
    }
  };

  const skipStepOne = () => {
    setStepStatus(prev => ({ ...prev, step1: true }));
  };

  const getFormattedStep2Answer = () => {
    const angle = currentAngle / 2;
    const rad = angle * Math.PI / 180;
    
    switch (selectedIdentity) {
      case 'sine':
        return `2(${Math.sin(rad).toFixed(3)})(${Math.cos(rad).toFixed(3)})`;
      case 'cosine':
        if (cosineVariant === 'onlyCos') {
          const cosVal = Math.cos(rad).toFixed(3);
          return `2(${cosVal})² - 1`;
        } else if (cosineVariant === 'onlySin') {
          const sinVal = Math.sin(rad).toFixed(3);
          return `1 - 2(${sinVal})²`;
        } else {
          const cosVal = Math.cos(rad).toFixed(3);
          const sinVal = Math.sin(rad).toFixed(3);
          return `(${cosVal})² - (${sinVal})²`;
        }
      case 'tangent': {
        const tanVal = calculateAnswer(angle, 'tangent');
        return `2(${tanVal})/(1 - (${tanVal})²)`;
      }
      default:
        return '';
    }
  };

  const skipStepTwo = () => {
    setStepAnswers(prev => ({ ...prev, step2: getFormattedStep2Answer() }));
    setStepStatus(prev => ({ ...prev, step2: true }));
  };

  const skipFinalStep = () => {
    setUserAnswer(calculateAnswer(currentAngle, selectedIdentity));
    setFeedback('Correct!');
  };

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Double Angle Identities</h1>
          <p className="text-sky-800">Learn how to solve trigonometric double angle problems step by step!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What are Double Angles?</h2>
            <p className="text-blue-600">
              A double angle is exactly what it sounds like - an angle that is twice as large as another angle. 
              For example: If θ = 30°, then 2θ = 60°. Double angle identities allow us to express trigonometric 
              functions of double angles (2θ) in terms of trigonometric functions of the original angle (θ).
            </p>
            <div className="mt-4 space-y-1">
              <p className="font-semibold text-blue-900">The Double Angle Identities:</p>
              <div className="space-y-2 font-mono text-blue-800">
                <p className="text-left">sin(2θ) = 2sin(θ)cos(θ)</p>
                <p className="text-left">cos(2θ) = cos²(θ) - sin²(θ)</p>
                <p className="text-left">cos(2θ) = 2cos²(θ) - 1</p>
                <p className="text-left">cos(2θ) = 1 - 2sin²(θ)</p>
                <p className="text-left flex items-center">tan(2θ) = 
                  <span className="inline-flex flex-col items-center mx-1">
                    <span>2tan(θ)</span>
                    <span className="border-t border-blue-800">1 - tan²(θ)</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Examples</h2>
            <div className="flex space-x-4 mb-4">
              <Button
                variant={selectedExample === 'sine' ? 'default' : 'outline'}
                onClick={() => setSelectedExample('sine')}
                className={selectedExample === 'sine' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                Sine
              </Button>
              <Button
                variant={selectedExample === 'cosine' ? 'default' : 'outline'}
                onClick={() => setSelectedExample('cosine')}
                className={selectedExample === 'cosine' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                Cosine
              </Button>
              <Button
                variant={selectedExample === 'tangent' ? 'default' : 'outline'}
                onClick={() => setSelectedExample('tangent')}
                className={selectedExample === 'tangent' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                Tangent
              </Button>
            </div>
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {selectedExample === 'sine' && (
                    <>
                      <p className="font-semibold pt-4 mb-4 text-left">Find sin(2θ) given sin(θ) = 0.500 and cos(θ) = 0.866</p>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Step 1: Identify the double angle identity to use</p>
                          <p className="text-center mt-2">sin(2θ) = 2sin(θ)cos(θ)</p>
                        </div>
                        <div>
                          <p className="font-medium">Step 2: Fill in values</p>
                          <p className="text-center mt-2">sin(2θ) = 2(0.500)(0.866)</p>
                        </div>
                        <div>
                          <p className="font-medium">Step 3: Simplify</p>
                          <div className="text-center mt-2 space-y-2">
                            <p>sin(2θ) = 2(0.500)(0.866)</p>
                            <p>sin(2θ) = 0.866</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedExample === 'cosine' && (
                    <>
                      <p className="font-semibold pt-4 mb-4 text-left">Find cos(2θ) given cos(θ) = 0.707 and sin(θ) = 0.707</p>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Step 1: Identify the double angle identity</p>
                          <p className="text-center mt-2">cos(2θ) = cos²(θ) - sin²(θ)</p>
                        </div>
                        <div>
                          <p className="font-medium">Step 2: Fill in values</p>
                          <p className="text-center mt-2">cos(2θ) = (0.707)² - (0.707)²</p>
                        </div>
                        <div>
                          <p className="font-medium">Step 3: Simplify</p>
                          <div className="text-center mt-2 space-y-2">
                            <p>cos(2θ) = (0.707)² - (0.707)²</p>
                            <p>cos(2θ) = 0.499849 - 0.499849</p>
                            <p>cos(2θ) = 0</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedExample === 'tangent' && (
                    <>
                      <p className="font-semibold pt-4 mb-4 text-left">Find tan(2θ) given tan(θ) = 0.577</p>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Step 1: Identify the double angle identity</p>
                          <div className="flex items-center justify-center mt-2">
                            <span>tan(2θ)</span>
                            <span className="mx-2">=</span>
                            <span className="inline-flex flex-col items-center">
                              <span>2tan(θ)</span>
                              <span className="border-t border-black">1 - tan²(θ)</span>
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Step 2: Fill in values</p>
                          <div className="flex items-center gap-2 justify-center">
                            <span>tan(2θ)</span>
                            <span>=</span>
                            <span className="inline-flex flex-col items-center mx-1">
                              <span>2(0.577)</span>
                              <span className="border-t border-black">1 - (0.577)²</span>
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Step 3: Simplify</p>
                          <div className="text-center mt-2 space-y-2 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                              <span>tan(2θ)</span>
                              <span>=</span>
                              <span className="inline-flex flex-col items-center mx-1">
                                <span>2(0.577)</span>
                                <span className="border-t border-black">1 - (0.577)²</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>tan(2θ)</span>
                              <span>=</span>
                              <span className="inline-flex flex-col items-center mx-1">
                                <span>1.154</span>
                                <span className="border-t border-black">1 - 0.333</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>tan(2θ)</span>
                              <span>=</span>
                              <span className="inline-flex flex-col items-center mx-1">
                                <span>1.154</span>
                                <span className="border-t border-black">0.667</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>tan(2θ)</span>
                              <span>=</span>
                              <span>1.732</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={generateNewProblem}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Problem
              </Button>
            </div>

            <div className="text-center text-xl mb-4">
              {selectedIdentity === 'cosine' ? (
                <span className="font-mono">
                  Find cos(2θ) given {
                    cosineVariant === 'both' ? 
                    `cos(θ) = ${Math.cos(currentAngle / 2 * Math.PI / 180).toFixed(3)} and sin(θ) = ${Math.sin(currentAngle / 2 * Math.PI / 180).toFixed(3)}` :
                    cosineVariant === 'onlyCos' ?
                    `cos(θ) = ${Math.cos(currentAngle / 2 * Math.PI / 180).toFixed(3)}` :
                    `sin(θ) = ${Math.sin(currentAngle / 2 * Math.PI / 180).toFixed(3)}`
                  }
                </span>
              ) : (
                <span className="font-mono">
                  {selectedIdentity === 'sine' ? (
                    `Find sin(2θ) given sin(θ) = ${Math.sin(currentAngle / 2 * Math.PI / 180).toFixed(3)} and cos(θ) = ${Math.cos(currentAngle / 2 * Math.PI / 180).toFixed(3)}`
                  ) : (
                    `Find ${selectedIdentity}(2θ) given ${selectedIdentity}(θ) = ${calculateAnswer(currentAngle / 2, selectedIdentity)}`
                  )}
                </span>
              )}
            </div>

            <Button 
              onClick={() => setShowSteps(true)}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showSteps && (
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <div className="space-y-6">
                  <div>
                    <p className="mb-2">1. Click the correct double angle identity to use:</p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        {!stepStatus.step1 ? (
                          <>
                            <Button
                              onClick={() => {
                                setStepAnswers(prev => ({ ...prev, step1: 'sin(2θ) = 2sin(θ)cos(θ)' }));
                                setStepStatus(prev => ({ ...prev, step1: selectedIdentity === 'sine' }));
                              }}
                              variant="outline"
                              className={`text-left p-4 ${
                                stepAnswers.step1 === 'sin(2θ) = 2sin(θ)cos(θ)' && !stepStatus.step1
                                  ? 'bg-red-50 border-red-500 text-red-700'
                                  : ''
                              }`}
                            >
                              sin(2θ) = 2sin(θ)cos(θ)
                            </Button>
                            <Button
                              onClick={() => {
                                setStepAnswers(prev => ({ ...prev, step1: 'cos(2θ) = cos²(θ) - sin²(θ)' }));
                                setStepStatus(prev => ({ ...prev, step1: selectedIdentity === 'cosine' && cosineVariant === 'both' }));
                              }}
                              variant="outline"
                              className={`text-left p-4 ${
                                stepAnswers.step1 === 'cos(2θ) = cos²(θ) - sin²(θ)' && !stepStatus.step1
                                  ? 'bg-red-50 border-red-500 text-red-700'
                                  : ''
                              }`}
                            >
                              cos(2θ) = cos²(θ) - sin²(θ)
                            </Button>
                            <Button
                              onClick={() => {
                                setStepAnswers(prev => ({ ...prev, step1: 'cos(2θ) = 2cos²(θ) - 1' }));
                                setStepStatus(prev => ({ ...prev, step1: selectedIdentity === 'cosine' && cosineVariant === 'onlyCos' }));
                              }}
                              variant="outline"
                              className={`text-left p-4 ${
                                stepAnswers.step1 === 'cos(2θ) = 2cos²(θ) - 1' && !stepStatus.step1
                                  ? 'bg-red-50 border-red-500 text-red-700'
                                  : ''
                              }`}
                            >
                              cos(2θ) = 2cos²(θ) - 1
                            </Button>
                            <Button
                              onClick={() => {
                                setStepAnswers(prev => ({ ...prev, step1: 'cos(2θ) = 1 - 2sin²(θ)' }));
                                setStepStatus(prev => ({ ...prev, step1: selectedIdentity === 'cosine' && cosineVariant === 'onlySin' }));
                              }}
                              variant="outline"
                              className={`text-left p-4 ${
                                stepAnswers.step1 === 'cos(2θ) = 1 - 2sin²(θ)' && !stepStatus.step1
                                  ? 'bg-red-50 border-red-500 text-red-700'
                                  : ''
                              }`}
                            >
                              cos(2θ) = 1 - 2sin²(θ)
                            </Button>
                            <Button
                              onClick={() => {
                                setStepAnswers(prev => ({ ...prev, step1: 'tan(2θ) = 2tan(θ)/(1 - tan²(θ))' }));
                                setStepStatus(prev => ({ ...prev, step1: selectedIdentity === 'tangent' }));
                              }}
                              variant="outline"
                              className={`text-left p-4 ${
                                stepAnswers.step1 === 'tan(2θ) = 2tan(θ)/(1 - tan²(θ))' && !stepStatus.step1
                                  ? 'bg-red-50 border-red-500 text-red-700'
                                  : ''
                              }`}
                            >
                              tan(2θ) = 2tan(θ)/(1 - tan²(θ))
                            </Button>
                          </>
                        ) : (
                          <div className="bg-green-50 border border-green-500 text-green-700 p-4 rounded">
                            {stepAnswers.step1}
                          </div>
                        )}
                      </div>
                      {!stepStatus.step1 && (
                        <div className="flex justify-start">
                          <Button
                            onClick={() => {
                              let correctFormula;
                              if (selectedIdentity === 'sine') {
                                correctFormula = 'sin(2θ) = 2sin(θ)cos(θ)';
                              } else if (selectedIdentity === 'cosine') {
                                if (cosineVariant === 'onlyCos') {
                                  correctFormula = 'cos(2θ) = 2cos²(θ) - 1';
                                } else if (cosineVariant === 'onlySin') {
                                  correctFormula = 'cos(2θ) = 1 - 2sin²(θ)';
                                } else {
                                  correctFormula = 'cos(2θ) = cos²(θ) - sin²(θ)';
                                }
                              } else {
                                correctFormula = 'tan(2θ) = 2tan(θ)/(1 - tan²(θ))';
                              }
                              setStepAnswers(prev => ({ ...prev, step1: correctFormula }));
                              setStepStatus(prev => ({ ...prev, step1: true }));
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {stepStatus.step1 && (
                    <div>
                      <p className="mb-2">2. Fill in values:</p>
                      <div className="space-y-2">
                        {!stepStatus.step2 ? (
                          <>
                            <div className={`flex items-center border rounded-md overflow-hidden relative ${
                              step2Error ? 'border-red-500' : ''
                            }`}>
                              <span className="bg-gray-100 px-3 py-2 text-gray-700 border-r rounded-l-md">
                                {selectedIdentity}(2θ) =
                              </span>
                              <div className="flex-1 relative">
                                <Input
                                  type="text"
                                  value={stepAnswers.step2}
                                  onChange={(e) => {
                                    setStepAnswers(prev => ({ ...prev, step2: e.target.value }));
                                    setStep2Error(false);
                                  }}
                                  placeholder="Enter the expression"
                                  className={`w-full border-0 rounded-l-none focus-visible:ring-1 focus-visible:ring-black focus-visible:right-[10px] focus-visible:-mt-px focus-visible:-mb-px focus-visible:absolute focus-visible:inset-x-0 ${
                                    step2Error ? 'bg-red-50' : ''
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-start">
                              <Button onClick={checkStepTwo} className="bg-blue-400 hover:bg-blue-500">Check</Button>
                              <Button onClick={skipStepTwo} className="bg-gray-400 hover:bg-gray-500">Skip</Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center py-2">
                            <span className="text-gray-700">
                              {selectedIdentity}(2θ) =
                            </span>
                            <span className="ml-2 font-bold text-green-600">
                              {stepAnswers.step2}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                    
                  {stepStatus.step2 && (
                    <div>
                      <p className="mb-2">3. Simplify:</p>
                      {!feedback ? (
                        <div className="flex items-center gap-4">
                          <Input 
                            type="number"
                            step="0.001"
                            value={userAnswer}
                            onChange={(e) => {
                              setUserAnswer(e.target.value);
                              setHasError(false);
                            }}
                            placeholder="Enter your answer"
                            className={`flex-1 ${hasError ? 'border-red-500' : 'border-blue-300'}`}
                          />
                          <div className="flex gap-4">
                            <Button
                              onClick={checkAnswer}
                              className="bg-blue-400 hover:bg-blue-500"
                            >
                              Check
                            </Button>
                            <Button
                              onClick={skipFinalStep}
                              className="bg-gray-400 hover:bg-gray-500 text-white"
                            >
                              Skip
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center py-2">
                          <span className="font-bold text-green-600">
                            {calculateAnswer(currentAngle, selectedIdentity)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {feedback && feedback.includes('Correct') && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                      <p className="text-green-700">
                        You've successfully solved the double angle identity problem!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Practice makes perfect! Keep working with double angle identities to master these concepts.
      </p>
    </div>
  );
};

export default DoubleAngleIdentity;