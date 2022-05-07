import { create } from '@apis/settings';

const Settings = create('reply-modifications');

const { byDisplayName, byProps } = Webpack.Filters;

const [
  { marginTop20 },
  FormItem,
  RadioGroup,
  FormDivider,
]: [
    { marginTop20: string; },
    import('discord-types/components').FormItem,
    import('discord-types/components').RadioGroup,
    ...((props: any) => JSX.Element)[]
  ] = Webpack.bulk(
    byProps('marginTop20'),
    byDisplayName('FormItem'),
    byDisplayName('RadioGroup'),
    byDisplayName('FormDivider'),
    byDisplayName('SwitchItem'),
  ) as any;

export enum IncomingValues {
  DEFAULT,
  FORCE,
  SUPPRESS,
}

export enum OutgoingValues {
  DEFAULT,
  REMEMBER,
  SUPPRESS,
}

export default () => {
  const [incomingChoice, setIncomingChoice] = Settings.use('incoming', IncomingValues.DEFAULT);
  const [outgoingChoice, setOutgoingChoice] = Settings.use('outgoing', OutgoingValues.DEFAULT);

  return (
    <>
      <FormItem
        tag={FormItem.Tags.H5}
        title='Incoming Replies (messages sent by other users)'
      >
        <RadioGroup
          value={incomingChoice}
          onChange={({ value }) => void setIncomingChoice(value)}
          options={[{
            name: 'Default Behavior',
            desc: 'Do not change the behavior of incoming replies.',
            value: IncomingValues.DEFAULT,
          }, {
            name: 'Force Mentions',
            desc: 'Force all incoming replies to your messages to ping you.',
            value: IncomingValues.FORCE,
          }, {
            name: 'Suppress Mentions',
            desc: 'Force all incoming replies to your messages to not ping you.',
            value: IncomingValues.SUPPRESS,
          }]}
        />
      </FormItem>
      <FormDivider className={marginTop20} />
      <FormItem
        tag={FormItem.Tags.H5}
        className={marginTop20}
        title='Outgoing Replies (messages sent by you)'
      >
        <RadioGroup
          value={outgoingChoice}
          onChange={({ value }) => void setOutgoingChoice(value)}
          options={[{
            name: 'Always On',
            desc: 'This is the default behavior for outgoing replies.',
            value: OutgoingValues.DEFAULT,
          }, {
            name: 'Remember Choice',
            desc: 'Save your last choice and use that as the outgoing behavior.',
            value: OutgoingValues.REMEMBER,
          }, {
            name: 'Always Off',
            desc: 'Always toggle off outgoing replies.',
            value: OutgoingValues.SUPPRESS,
          }]}
        />
      </FormItem>
    </>
  );
};
