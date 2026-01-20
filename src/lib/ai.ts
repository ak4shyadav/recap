export interface RecapOutput {
  executive_summary: string;
  key_highlights: string[];
  decisions_taken: string[];
  risks_blockers: string[];
  action_items: string[];
  next_steps: string[];
}

export async function generateRecap(inputText: string): Promise<RecapOutput> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    executive_summary: `This is a mock executive summary generated from your input: "${inputText.slice(0, 50)}${inputText.length > 50 ? '...' : ''}". The AI analysis has processed the key themes and generated insights.`,
    key_highlights: [
      'Primary objective identified and documented',
      'Stakeholder alignment achieved',
      'Resource requirements clarified',
      'Timeline expectations established'
    ],
    decisions_taken: [
      'Approved technical approach for implementation',
      'Assigned team leads for each workstream',
      'Established weekly checkpoint meetings'
    ],
    risks_blockers: [
      'Potential resource constraints in Q2',
      'Dependency on external API stability',
      'Technical debt in legacy systems'
    ],
    action_items: [
      'Schedule kickoff meeting by end of week',
      'Document technical specifications',
      'Set up monitoring and alerting',
      'Create rollback procedures'
    ],
    next_steps: [
      'Review and finalize project plan',
      'Begin Phase 1 implementation',
      'Conduct weekly progress reviews',
      'Prepare status report for leadership'
    ]
  };
}
