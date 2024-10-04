import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [language, setLanguage] = useState('it');
  const [showInfo, setShowInfo] = useState(false);
  const [inputType, setInputType] = useState('file');
  const [minzincFile, setMinzincFile] = useState(null);
  const [datazincFile, setDatazincFile] = useState(null);
  const [minzincText, setMinzincText] = useState('');
  const [datazincText, setDatazincText] = useState('');
  const [timeout, setTimeout] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [image, setImage] = useState(null);

  // Oggetto con le traduzioni
  const translations = {
    it: {
      title: "MiniZinc Solver",
      uploadFile: "Carica file",
      writeModel: "Scrivi modello",
      minzincFile: "File Modello MiniZinc (.mzn):",
      datazincFile: "File Modello DataZinc (.dzn) (opzionale):",
      minzincModel: "Modello MiniZinc:",
      datazincModel: "Modello DataZinc (opzionale):",
      timeout: "Timeout (secondi):",
      solve: "Risolvi",
      processing: "Elaborazione in corso...",
      findingSolutions: "Ricerca soluzioni...",
      result: "Risultato:",
      paretoFront: "Grafico del fronte di Pareto:",
      timeoutError: (timeout) => `L'elaborazione ha superato il tempo massimo consentito (${timeout} secondi). Prova a semplificare il modello o aumentare il timeout.`,
      genericError: "Si è verificato un errore durante la comunicazione con il server.",
      changeLanguage: "Change to English",
      info: "Info",
      infoText: "Questo è un solver MiniZinc che ti permette di risolvere problemi di ottimizzazione. Puoi caricare file o scrivere direttamente i modelli."
    },
    en: {
      title: "MiniZinc Solver",
      uploadFile: "Upload file",
      writeModel: "Write model",
      minzincFile: "MiniZinc Model File (.mzn):",
      datazincFile: "DataZinc Model File (.dzn) (optional):",
      minzincModel: "MiniZinc Model:",
      datazincModel: "DataZinc Model (optional):",
      timeout: "Timeout (seconds):",
      solve: "Solve",
      processing: "Processing...",
      findingSolutions: "Finding solutions...",
      result: "Result:",
      paretoFront: "Pareto Front Graph:",
      timeoutError: (timeout) => `Processing exceeded the maximum allowed time (${timeout} seconds). Try simplifying the model or increasing the timeout.`,
      genericError: "An error occurred while communicating with the server.",
      changeLanguage: "Cambia in Italiano",
      info: "Info",
      infoText: "This is a MiniZinc solver that allows you to solve optimization problems. You can upload files or write models directly."
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'it' ? 'en' : 'it');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setIsLoading(true);
    setResult('');
    setImage(null);

    const formData = new FormData();
    formData.append('inputType', inputType);
    formData.append('timeout', timeout);

    if (inputType === 'file') {
      if (minzincFile) formData.append('minzincFile', minzincFile);
      if (datazincFile) formData.append('datazincFile', datazincFile);
    } else {
      formData.append('minzincText', minzincText);
      formData.append('datazincText', datazincText);
    }

    try {
      console.log("Sending request to server");
      const response = await axios.post('http://localhost:5000/solve', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Received response:", response.data);

      if (response.data.status === 'success') {
        setResult(response.data.output);
        if (response.data.image) {
          setImage(`data:image/png;base64,${response.data.image}`);
        }
      } else {
        setResult(`${translations[language].genericError}: ${response.data.output}`);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setResult(`${translations[language].genericError}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <nav className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:h-16">
            <h1 
              className="text-xl sm:text-2xl font-bold text-white cursor-pointer hover:text-indigo-200 transition duration-150 ease-in-out mb-2 sm:mb-0"
              onClick={() => setShowInfo(false)}
            >
              {translations[language].title}
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-indigo-100 bg-indigo-700 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                {translations[language].info}
              </button>
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-indigo-600 bg-white rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                {translations[language].changeLanguage}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            {showInfo ? (
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-md">
                <p className="text-indigo-700">{translations[language].infoText}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-l-lg ${
                        inputType === 'file'
                          ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                          : 'text-indigo-600 bg-white hover:text-indigo-700 hover:bg-indigo-50'
                      } border border-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200`}
                      onClick={() => setInputType('file')}
                    >
                      {translations[language].uploadFile}
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-r-lg ${
                        inputType === 'text'
                          ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                          : 'text-indigo-600 bg-white hover:text-indigo-700 hover:bg-indigo-50'
                      } border border-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200`}
                      onClick={() => setInputType('text')}
                    >
                      {translations[language].writeModel}
                    </button>
                  </div>
                </div>

                {inputType === 'file' ? (
                  <>
                    <div>
                      <label htmlFor="minzincFile" className="block text-sm font-medium text-gray-700 mb-1">
                        {translations[language].minzincFile}
                      </label>
                      <input
                        type="file"
                        id="minzincFile"
                        accept=".mzn"
                        onChange={(e) => setMinzincFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                    <div>
                      <label htmlFor="datazincFile" className="block text-sm font-medium text-gray-700 mb-1">
                        {translations[language].datazincFile}
                      </label>
                      <input
                        type="file"
                        id="datazincFile"
                        accept=".dzn"
                        onChange={(e) => setDatazincFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="minzincText" className="block text-sm font-medium text-gray-700 mb-1">
                        {translations[language].minzincModel}
                      </label>
                      <textarea
                        id="minzincText"
                        value={minzincText}
                        onChange={(e) => setMinzincText(e.target.value)}
                        rows="6"
                        className="w-full px-3 py-2 text-sm sm:text-base text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                        placeholder="Enter your MiniZinc model here..."
                      />
                    </div>
                    <div>
                      <label htmlFor="datazincText" className="block text-sm font-medium text-gray-700 mb-1">
                        {translations[language].datazincModel}
                      </label>
                      <textarea
                        id="datazincText"
                        value={datazincText}
                        onChange={(e) => setDatazincText(e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 text-sm sm:text-base text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                        placeholder="Enter your DataZinc model here (optional)..."
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-1">
                    {translations[language].timeout}
                  </label>
                  <input
                    type="number"
                    id="timeout"
                    value={timeout}
                    onChange={(e) => setTimeout(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                    className="w-full px-3 py-2 text-sm sm:text-base text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-center">
                  <button 
                    type="submit" 
                    className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? translations[language].processing : translations[language].solve}
                  </button>
                </div>
              </form>
            )}

            {isLoading && (
              <div className="mt-8 text-center text-base sm:text-lg font-semibold text-indigo-600 animate-pulse">
                {translations[language].findingSolutions}
              </div>
            )}

            {result && (
              <div className="mt-8">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-indigo-600">{translations[language].result}</h2>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto whitespace-pre-wrap text-xs sm:text-sm">
                  {result}
                </pre>
              </div>
            )}

            {image && (
              <div className="mt-8">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-indigo-600">{translations[language].paretoFront}</h2>
                <img src={image} alt="Pareto Front" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;