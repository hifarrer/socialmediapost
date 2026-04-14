import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AgentGraphService } from '@gitroom/nestjs-libraries/agent/agent.graph.service';

@Injectable()
export class AgentRun {
  constructor(private _agentGraphService: AgentGraphService) {}
  @Command({
    command: 'run:agent',
    describe: 'Run the agent',
  })
  async agentRun() {
    const stream = this._agentGraphService.start('local-org', {
      research: 'Write a short post about using Postiz for content planning.',
      isPicture: false,
      format: 'one_short',
      tone: 'personal',
    });

    for await (const event of stream) {
      console.log(event);
      break;
    }
  }
}
