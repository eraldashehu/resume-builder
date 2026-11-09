import { useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Field } from './Field';
import { emptyEducation, emptyExperience } from '../data/sample';
import { suggestSummary } from '../lib/summary';
import { totalYears } from '../lib/format';
import type { Education, Experience, ListKey, PersonalInfo, Resume } from '../types';

interface SectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

function Section({ title, children, action }: SectionProps) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

interface EditorProps {
  resume: Resume;
  setResume: Dispatch<SetStateAction<Resume>>;
}

type ItemOf<K extends ListKey> = Resume[K][number];

export function Editor({ resume, setResume }: EditorProps) {
  const [summaryNote, setSummaryNote] = useState('');
  const { personal, experience, education } = resume;

  const update = <K extends keyof Resume>(key: K, value: Resume[K]) => setResume((r) => ({ ...r, [key]: value }));
  const updatePersonal = (key: keyof PersonalInfo, value: string) => update('personal', { ...personal, [key]: value });

  function updateItem<K extends ListKey, F extends keyof ItemOf<K>>(listKey: K, id: string, field: F, value: ItemOf<K>[F]) {
    const list = resume[listKey] as ItemOf<K>[];
    update(listKey, list.map((item) => (item.id === id ? { ...item, [field]: value } : item)) as Resume[K]);
  }
  const updateJob = <F extends keyof Experience>(id: string, field: F, value: Experience[F]) => updateItem('experience', id, field, value);
  const updateEdu = <F extends keyof Education>(id: string, field: F, value: Education[F]) => updateItem('education', id, field, value);

  function removeItem(listKey: ListKey, id: string) {
    const list = resume[listKey] as { id: string }[];
    update(listKey, list.filter((item) => item.id !== id) as Resume[typeof listKey]);
  }

  function moveJob(index: number, dir: -1 | 1) {
    const list = [...experience];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    update('experience', list);
  }

  function handleSuggestSummary() {
    update('summary', suggestSummary({ title: personal.title, skills: resume.skills, years: totalYears(experience) }));
    setSummaryNote('Built from your job title, experience and skills. Edit it to make it yours.');
  }

  return (
    <div className="editor">
      <Section title="Personal info">
        <div className="grid-2">
          <Field id="name" label="Full name" value={personal.name} onChange={(v) => updatePersonal('name', v)} />
          <Field id="title" label="Job title" value={personal.title} onChange={(v) => updatePersonal('title', v)} />
          <Field id="email" label="Email" type="email" value={personal.email} onChange={(v) => updatePersonal('email', v)} />
          <Field id="phone" label="Phone" type="tel" value={personal.phone} onChange={(v) => updatePersonal('phone', v)} />
          <Field id="location" label="Location" value={personal.location} onChange={(v) => updatePersonal('location', v)} />
          <Field id="website" label="Website / LinkedIn" value={personal.website} onChange={(v) => updatePersonal('website', v)} />
        </div>
      </Section>

      <Section
        title="Summary"
        action={
          <button type="button" className="btn-suggest" onClick={handleSuggestSummary}>
            Suggest a summary
          </button>
        }
      >
        <Field
          id="summary"
          label="Professional summary"
          multiline
          value={resume.summary}
          onChange={(v) => update('summary', v)}
          hint={summaryNote || 'Two or three sentences about what you do best.'}
        />
      </Section>

      <Section
        title="Experience"
        action={
          <button type="button" className="btn-ghost" onClick={() => update('experience', [...experience, emptyExperience()])}>
            + Add job
          </button>
        }
      >
        {experience.length === 0 && <p className="empty">No jobs yet. Add your most recent role first.</p>}
        {experience.map((job, i) => (
          <div className="item" key={job.id}>
            <div className="item-tools">
              <span className="item-index">Job {i + 1}</span>
              <button type="button" onClick={() => moveJob(i, -1)} aria-label="Move up" disabled={i === 0}>↑</button>
              <button type="button" onClick={() => moveJob(i, 1)} aria-label="Move down" disabled={i === experience.length - 1}>↓</button>
              <button type="button" className="danger" onClick={() => removeItem('experience', job.id)}>Remove</button>
            </div>
            <div className="grid-2">
              <Field id={`role-${job.id}`} label="Role" value={job.role} onChange={(v) => updateJob(job.id, 'role', v)} />
              <Field id={`company-${job.id}`} label="Company" value={job.company} onChange={(v) => updateJob(job.id, 'company', v)} />
              <Field id={`start-${job.id}`} label="Start" type="month" value={job.start} onChange={(v) => updateJob(job.id, 'start', v)} />
              {job.current ? (
                <div className="field">
                  <span className="field-label">End</span>
                  <div className="present">Present</div>
                </div>
              ) : (
                <Field id={`end-${job.id}`} label="End" type="month" value={job.end} onChange={(v) => updateJob(job.id, 'end', v)} />
              )}
            </div>
            <label className="check">
              <input type="checkbox" checked={job.current} onChange={(e) => updateJob(job.id, 'current', e.target.checked)} />
              I currently work here
            </label>
            <Field
              id={`bullets-${job.id}`}
              label="Achievements"
              multiline
              rows={3}
              value={job.bullets}
              onChange={(v) => updateJob(job.id, 'bullets', v)}
              hint="One achievement per line. Start with a verb and add a number when you can."
            />
          </div>
        ))}
      </Section>

      <Section
        title="Education"
        action={
          <button type="button" className="btn-ghost" onClick={() => update('education', [...education, emptyEducation()])}>
            + Add school
          </button>
        }
      >
        {education.map((edu) => (
          <div className="item" key={edu.id}>
            <div className="item-tools">
              <span className="item-index">{edu.school || 'New school'}</span>
              <button type="button" className="danger" onClick={() => removeItem('education', edu.id)}>Remove</button>
            </div>
            <div className="grid-2">
              <Field id={`degree-${edu.id}`} label="Degree" value={edu.degree} onChange={(v) => updateEdu(edu.id, 'degree', v)} />
              <Field id={`school-${edu.id}`} label="School" value={edu.school} onChange={(v) => updateEdu(edu.id, 'school', v)} />
              <Field id={`estart-${edu.id}`} label="Start year" value={edu.start} onChange={(v) => updateEdu(edu.id, 'start', v)} />
              <Field id={`eend-${edu.id}`} label="End year" value={edu.end} onChange={(v) => updateEdu(edu.id, 'end', v)} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Skills">
        <Field id="skills" label="Skills" value={resume.skills} onChange={(v) => update('skills', v)} hint="Separate skills with commas." />
      </Section>
    </div>
  );
}
