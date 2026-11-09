import { useState } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { useLocalStorage } from './hooks/useLocalStorage';
import { accents, blankResume, sampleResume } from './data/sample';
import type { Resume, ResumeSettings, Template } from './types';

type View = 'edit' | 'preview';

export default function App() {
  const [resume, setResume] = useLocalStorage<Resume>('resumeforge:v1', sampleResume);
  const [view, setView] = useState<View>('edit');
  const [confirmReset, setConfirmReset] = useState(false);

  const setSetting = <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) =>
    setResume((r) => ({ ...r, settings: { ...r.settings, [key]: value } }));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden="true">R</span>
          <div>
            <strong>ResumeForge</strong>
            <small>Free · Private · No sign-up</small>
          </div>
        </div>
        <div className="top-actions">
          <div className="swatches" role="radiogroup" aria-label="Accent color">
            {accents.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={resume.settings.accent === c}
                aria-label={`Accent ${c}`}
                className="swatch"
                style={{ background: c }}
                onClick={() => setSetting('accent', c)}
              />
            ))}
          </div>
          <select
            aria-label="Template"
            value={resume.settings.template}
            onChange={(e) => setSetting('template', e.target.value as Template)}
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
          </select>
          {confirmReset ? (
            <span className="confirm">
              Clear everything?
              <button
                type="button"
                className="danger"
                onClick={() => {
                  setResume(blankResume);
                  setConfirmReset(false);
                }}
              >
                Yes, clear
              </button>
              <button type="button" onClick={() => setConfirmReset(false)}>Cancel</button>
            </span>
          ) : (
            <>
              <button type="button" className="btn-ghost" onClick={() => setResume(sampleResume)}>Load example</button>
              <button type="button" className="btn-ghost" onClick={() => setConfirmReset(true)}>Start blank</button>
            </>
          )}
          <button type="button" className="btn-primary" onClick={() => window.print()}>Download PDF</button>
        </div>
      </header>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={view === 'edit'} onClick={() => setView('edit')}>Edit</button>
        <button role="tab" aria-selected={view === 'preview'} onClick={() => setView('preview')}>Preview</button>
      </div>

      <main className={`workspace show-${view}`}>
        <div className="pane-edit">
          <Editor resume={resume} setResume={setResume} />
        </div>
        <div className="pane-preview">
          <Preview resume={resume} />
          <p className="print-tip">Tip: in the print window choose “Save as PDF” and turn off headers and footers.</p>
        </div>
      </main>
    </div>
  );
}
