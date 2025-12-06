import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  UserCheck, 
  ArrowDown, 
  RotateCcw,
  Play,
  Briefcase,
  CheckSquare,
  ChevronDown
} from 'lucide-react';
import { StepCard } from './components/StepCard';
import { StepId, ChecklistState } from './types';

function App() {
  // --- State Management ---
  const [activeStepId, setActiveStepId] = useState<StepId>(StepId.START);
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  
  // Checklist Data
  const [checklistData, setChecklistData] = useState<ChecklistState>({
    achievements: false,
    date: false,
    files: false,
    notify: false
  });

  const [showErrorShake, setShowErrorShake] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // Refs for scrolling
  const stepsRef = useRef<Record<string, HTMLDivElement | null>>({});

  // --- Effects ---

  // Auto-scroll to active step
  useEffect(() => {
    if (stepsRef.current[activeStepId]) {
      stepsRef.current[activeStepId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeStepId]);

  // --- Handlers ---

  const handleNext = (nextId: StepId) => {
    // Add current to completed if not already there
    if (!completedSteps.includes(activeStepId)) {
      setCompletedSteps(prev => [...prev, activeStepId]);
    }
    setActiveStepId(nextId);
  };

  const handleReset = () => {
    setActiveStepId(StepId.START);
    setCompletedSteps([]);
    setChecklistData({
      achievements: false,
      date: false,
      files: false,
      notify: false
    });
    setIsReturning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleChecklist = (key: keyof ChecklistState) => {
    setChecklistData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChecklistSubmit = () => {
    const allChecked = Object.values(checklistData).every(val => val === true);
    if (allChecked) {
      handleNext(StepId.REVIEW);
    } else {
      setShowErrorShake(true);
      setTimeout(() => setShowErrorShake(false), 500);
    }
  };

  const handleReturnToProcess = () => {
    setIsReturning(true);
    // Simulate API delay / User noticing the return
    setTimeout(() => {
      // Remove steps from completed history to force re-do
      setCompletedSteps(prev => prev.filter(s => 
        s !== StepId.IN_PROCESS && 
        s !== StepId.CHECKLIST && 
        s !== StepId.REVIEW
      ));
      
      // Reset checklist
      setChecklistData({
        achievements: false,
        date: false,
        files: false,
        notify: false
      });
      
      setActiveStepId(StepId.IN_PROCESS);
      setIsReturning(false);
    }, 1500);
  };

  // --- Render Helpers ---

  const Connector = () => (
    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -mt-12 h-14 w-0.5 bg-slate-300 z-0 flex items-end justify-center">
      <ChevronDown className="text-slate-400 mb-1" size={16} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 pb-32">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4 text-indigo-700">
            <Briefcase size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Flujograma de Asignación
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Guía interactiva para el ciclo de vida de una tarea. Sigue los pasos y valida los requisitos.
          </p>
          
          {completedSteps.length > 0 && (
             <button 
             onClick={handleReset}
             className="mt-6 inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
           >
             <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar Simulación
           </button>
          )}
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line Background (Desktop: Center, Mobile: Left) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 transform -translate-x-1/2 z-0"></div>
          
          {/* --- STEP: START --- */}
          <div ref={el => stepsRef.current[StepId.START] = el}>
            <StepCard 
              id={StepId.START}
              title="INICIO: Nueva Asignación" 
              icon={Play} 
              color="blue"
              isActive={activeStepId === StepId.START}
              isCompleted={completedSteps.includes(StepId.START)}
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <p className="text-slate-600 leading-relaxed mb-4">
                    El Titular crea una asignación en el sistema. Esta acción dispara el inicio del flujo de trabajo y te notifica inmediatamente.
                  </p>
                  {activeStepId === StepId.START && (
                    <button 
                      onClick={() => handleNext(StepId.ASSIGNED)}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 group"
                    >
                      Recibir Asignación 
                      <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                    </button>
                  )}
                </div>
                <div className="hidden md:block w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🚀</span>
                </div>
              </div>
            </StepCard>
          </div>

          <Connector />

          {/* --- STEP 1: ASSIGNED --- */}
          <div ref={el => stepsRef.current[StepId.ASSIGNED] = el}>
            <StepCard 
              id={StepId.ASSIGNED}
              title="Estado: ASIGNADO" 
              icon={UserCheck} 
              color="yellow"
              isActive={activeStepId === StepId.ASSIGNED}
              isCompleted={completedSteps.includes(StepId.ASSIGNED)}
            >
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-3">
                  <Clock className="text-amber-600 shrink-0 mt-1" size={20} />
                  <div>
                    <span className="block text-amber-800 font-bold text-sm uppercase">SLA: Tiempo Máximo</span>
                    <span className="text-amber-900 font-medium">2 horas para cambiar de estado</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Leer la asignación completa",
                    "Planificar la ejecución",
                    "Identificar fechas y lugares",
                    "Preparar recursos necesarios"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                
                {activeStepId === StepId.ASSIGNED && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Acción Requerida:</p>
                    <button 
                      onClick={() => handleNext(StepId.IN_PROCESS)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-amber-500/30"
                    >
                      Iniciar Trabajo (Cambiar a "En Proceso")
                    </button>
                  </div>
                )}
              </div>
            </StepCard>
          </div>

          <Connector />

          {/* --- STEP 2: IN PROCESS --- */}
          <div ref={el => stepsRef.current[StepId.IN_PROCESS] = el}>
            <StepCard 
              id={StepId.IN_PROCESS}
              title="Estado: EN PROCESO" 
              icon={Briefcase} 
              color="indigo"
              isActive={activeStepId === StepId.IN_PROCESS}
              isCompleted={completedSteps.includes(StepId.IN_PROCESS)}
            >
              <div className="space-y-4">
                <p className="text-slate-600">
                  En esta etapa realizas el trabajo de campo o administrativo. El sistema registra el tiempo transcurrido.
                </p>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-2 text-sm">Actividades Típicas:</h4>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-indigo-400" /> Gestionar en juzgados / instituciones</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-indigo-400" /> Redactar escritos y documentos</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-indigo-400" /> Obtener firmas o sellos</li>
                  </ul>
                </div>

                {activeStepId === StepId.IN_PROCESS && (
                  <div className="mt-6">
                    <button 
                      onClick={() => handleNext(StepId.CHECKLIST)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-indigo-500/30 flex justify-between items-center group"
                    >
                      <span>Terminar Tarea</span>
                      <span className="bg-indigo-500 px-2 py-1 rounded text-xs group-hover:bg-indigo-400 transition-colors">Ir a validación</span>
                    </button>
                  </div>
                )}
              </div>
            </StepCard>
          </div>

          <Connector />

          {/* --- CHECKLIST GATE --- */}
          <div ref={el => stepsRef.current[StepId.CHECKLIST] = el}>
            <StepCard 
              id={StepId.CHECKLIST}
              title="Validación de Entrega" 
              icon={CheckSquare} 
              color="purple"
              isActive={activeStepId === StepId.CHECKLIST}
              isCompleted={completedSteps.includes(StepId.CHECKLIST)}
            >
              <div className="space-y-5">
                <div className="flex items-start gap-3 text-purple-900 bg-purple-50 p-3 rounded-lg text-sm">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>Antes de enviar a revisión, debes completar <strong>obligatoriamente</strong> estos campos en el sistema.</p>
                </div>
                
                <div className={`space-y-3 transition-transform duration-300 ${showErrorShake ? 'translate-x-1' : ''} ${showErrorShake ? '-translate-x-1' : ''}`}>
                  {[
                    { key: 'achievements', label: 'Llenar "Resultados y Logros"' },
                    { key: 'date', label: 'Registrar "Fecha de Resultado"' },
                    { key: 'files', label: 'Adjuntar evidencia en "Archivos"' },
                    { key: 'notify', label: 'Activar "Notificar Resultado"' },
                  ].map((item) => (
                    <label 
                      key={item.key}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        checklistData[item.key as keyof ChecklistState] 
                          ? 'bg-purple-50 border-purple-500 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-4 transition-colors ${
                        checklistData[item.key as keyof ChecklistState] 
                          ? 'bg-purple-500 border-purple-500' 
                          : 'border-slate-300'
                      }`}>
                        {checklistData[item.key as keyof ChecklistState] && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={checklistData[item.key as keyof ChecklistState]} 
                        onChange={() => activeStepId === StepId.CHECKLIST && toggleChecklist(item.key as keyof ChecklistState)}
                        disabled={activeStepId !== StepId.CHECKLIST}
                      />
                      <span className={`font-medium ${checklistData[item.key as keyof ChecklistState] ? 'text-purple-900' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                {activeStepId === StepId.CHECKLIST && (
                  <div className="mt-6">
                     {showErrorShake && (
                      <p className="text-red-500 text-sm text-center mb-2 font-medium animate-pulse">
                        ⚠️ Faltan campos por completar
                      </p>
                    )}
                    <button 
                      onClick={handleChecklistSubmit}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-purple-500/30"
                    >
                      Enviar a Revisión
                    </button>
                  </div>
                )}
              </div>
            </StepCard>
          </div>

          <Connector />

          {/* --- STEP 3: PENDING REVIEW --- */}
          <div ref={el => stepsRef.current[StepId.REVIEW] = el}>
            <StepCard 
              id={StepId.REVIEW}
              title="Estado: PENDIENTE DE REVISIÓN" 
              icon={FileText} 
              color="teal"
              isActive={activeStepId === StepId.REVIEW}
              isCompleted={completedSteps.includes(StepId.REVIEW)}
            >
              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-teal-600" size={18} />
                    <span className="text-teal-900 font-bold text-sm">Tiempo de Espera: 24 - 48 Horas</span>
                  </div>
                  <p className="text-teal-800 text-sm">
                    El Titular está verificando la calidad de la información y los adjuntos.
                  </p>
                </div>

                {activeStepId === StepId.REVIEW && (
                  <div className="border-t border-slate-100 pt-6">
                    <p className="text-center font-bold text-slate-800 mb-6">
                      👇 Simulación: ¿Qué decide el Titular?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Success Path */}
                      <button 
                        onClick={() => handleNext(StepId.COMPLETED)}
                        className="group relative overflow-hidden bg-white border-2 border-green-500 hover:bg-green-50 text-green-700 p-4 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                            <CheckCircle2 size={20} />
                          </div>
                          <span className="font-bold">Aprobar</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-[44px]">Todo está correcto.</p>
                      </button>

                      {/* Fail Path */}
                      <button 
                        onClick={handleReturnToProcess}
                        className="group relative overflow-hidden bg-white border-2 border-red-400 hover:bg-red-50 text-red-700 p-4 rounded-xl transition-all hover:shadow-lg text-left"
                      >
                         <div className="flex items-center gap-3 mb-1">
                          <div className="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                            <RotateCcw size={20} />
                          </div>
                          <span className="font-bold">Devolver</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-[44px]">Falta información.</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </StepCard>
          </div>

          {/* --- FINAL STATE: COMPLETED --- */}
          {activeStepId === StepId.COMPLETED && (
             <div ref={el => stepsRef.current[StepId.COMPLETED] = el} className="animate-in fade-in zoom-in duration-500">
              <div className="relative z-10 w-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-2xl text-white overflow-hidden p-8 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-extrabold mb-2">¡Asignación Completada!</h2>
                <p className="text-green-100 text-lg mb-8">El ciclo ha cerrado exitosamente.</p>
                
                <div className="inline-block bg-white/10 rounded-lg p-4 backdrop-blur-md border border-white/20">
                  <p className="font-mono text-sm opacity-80">ESTADO FINAL</p>
                  <p className="text-xl font-bold tracking-widest">CERRADO</p>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handleReset}
                    className="bg-white text-green-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-50 transition-colors"
                  >
                    Nueva Simulación
                  </button>
                </div>
              </div>
             </div>
          )}

          {/* --- RETURN OVERLAY --- */}
          {isReturning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center transform animate-bounce">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Asignación Devuelta</h3>
                <p className="text-slate-500">
                  El titular ha encontrado inconsistencias. Regresando al estado "En Proceso" para correcciones.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
