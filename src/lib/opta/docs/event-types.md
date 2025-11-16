# Opta Event Types

| Event ID | Name | Description |
|----------|------|-------------|
| 1 | Pass | The attempted delivery of the ball from one player to another player on the same team. A player can use any part of their body (permitted in the laws of the game) to execute a pass. Event categorization includes open play passes, goal kicks, corners and free kicks played as passes. Crosses, keeper throws, and throw ins do not count as passes. Opta adds a whole range of qualifiers to each pass event, so that various aspects can be measured.<br><br>**Outcome:** 0 = Unsuccessful pass = pass did not find teammate \| 1 = Successful pass |
| 2 | Offside Pass | A pass attempt where the intended receiving player is called offside.<br><br>**Outcome:** always set to 1 |
| 3 | Take On | Attempted dribble past an opponent (excluding when qualifier 211 is present as this is 'overrun' and is not always a duel event) |
| 4 | Foul | Indicates a foul has been committed. The event comes in pairs, with one for the team committing the foul (has outcome = 0) and another for the team fouled (outcome = 1). |
| 5 | Out | Indicates the ball has gone out of play for a throw-in or goal kick. The event comes in pairs, with one for the team who have put the ball out of play (outcome = 0) and another for the team who will resume the match in possession (outcome = 1). |
| 6 | Corner Awarded | Indicates the ball has gone out of play for a corner kick. The event comes in pairs, with one for the team who have conceded the corner (outcome = 0) and another for the team who have won the corner (outcome = 1). |
| 7 | Tackle | A tackle is defined when a player connects with the ball in a legal, ground level challenge and successfully takes the ball away from the opposition player. The tackled player must be in controlled possession of the ball to be tackled by an opposition player.<br><br>**Outcome:** 1 = tackling player's team gains possession or the ball goes out of play. 0 = possession remains with the opponent. |
| 8 | Interception | When a player intercepts any pass event between opposition players and prevents the ball reaching its target. Cannot be a clearance.<br><br>**Outcome:** always set to 1 |
| 10 | Save | A goalkeeper preventing the ball from entering the goal with any part of their body when facing an intentional attempt from an opposition player. Can also be an outfield player event with qualifier 94 for blocked shot.<br><br>**Outcome:** always set to 1 |
| 11 | Claim | Goalkeeper event; catching a crossed ball<br><br>**Outcome:** 0 = Keeper drops the ball after an attempted catch from a cross. They may then pick up the ball again and retain possession - this would be a separate event.<br>1 = Keeper catches the cross in one attempt, for example no drop. |
| 12 | Clearance | A defensive action when a player attempts to get the ball away from a dangerous zone on the pitch with no immediate target regarding a recipient for the ball.<br><br>**Outcome:** always set to 1 |
| 13 | Miss | Any shot on goal which goes wide or over the goal<br><br>**Outcome:** always set to 1 |
| 14 | Post | Whenever the ball hits the frame of the goal.<br><br>**Outcome:** always set to 1 |
| 15 | Attempt Saved | Shot saved - this event is for the player who made the shot. Qualifier 82 can be added for blocked shot.<br><br>**Outcome:** always set to 1 |
| 16 | Goal | Attributing a goal to the goal scoring player. Given any contention around assigning a goal to an appropriate player, Opta applies its own rules and when applicable aligns decisions to the relevant official competition governing body.<br><br>**Outcome:** always set to 1 |
| 17 | Card | Cards are collected as yellow, second yellow or red card. Opta cross-checks the cards against the official sources to match the official statistics and aligns the collection unless there is recognition of a clear error.<br><br>**Outcome:** always set to 1 |
| 18 | Player Off | Player is substituted off.<br><br>**Outcome:** always set to 1 |
| 19 | Player on | Player comes on as a substitute.<br><br>**Outcome:** always set to 1 |
| 20 | Player retired | Player is forced to leave the pitch due to injury and the team have no substitutions left.<br><br>**Outcome:** always set to 1 |
| 21 | Player returns | Player comes back on the pitch.<br><br>**Outcome:** always set to 1 |
| 22 | Player becomes goalkeeper | When an outfield player has to replace the goalkeeper.<br><br>**Outcome:** always set to 1 |
| 23 | Goalkeeper becomes player | Goalkeeper becomes an outfield player.<br><br>**Outcome:** always set to 1 |
| 24 | Condition change | Change in playing conditions.<br><br>**Outcome:** always set to 1 |
| 25 | Official change | Referee or linesman is replaced.<br><br>**Outcome:** always set to 1 |
| 27 | Start delay | An event to capture when the referee stops the game, typically, for a player to receive treatment for an injury or if there is a VAR review underway and play is paused.<br><br>**Outcome:** always set to 1 |
| 28 | End delay | Used when the stoppage ends and play resumes.<br><br>**Outcome:** always set to 1 |
| 30 | End | End of a match period.<br><br>**Outcome:** always set to 1 |
| 32 | Start | Start of a match period.<br><br>**Outcome:** always set to 1 |
| 34 | Team set up | Team line up - qualifiers 30, 44, 59, 130, 131 will show player line up and formation.<br><br>**Outcome:** always set to 1 |
| 36 | Player changed Jersey number | Player is forced to change jersey number, qualifier will show the new number.<br><br>**Outcome:** always set to 1 |
| 37 | Collection End | Event 30 signals end of half. This signals end of the match and thus data collection.<br><br>**Outcome:** always set to 1 |
| 38 | Temp_Goal | Goal has occurred but it is pending additional detail qualifiers from Opta. Will change to event 16.<br><br>**Outcome:** always set to 1 |
| 39 | Temp_Attempt | Shot on goal has occurred but is pending additional detail qualifiers from Opta. Will change to event 15.<br><br>**Outcome:** always set to 1 |
| 40 | Formation change | Team alters its formation.<br><br>**Outcome:** always set to 1 |
| 41 | Punch | Goalkeeper event; ball is punched clear.<br><br>**Outcome:** 0 = the punch lands at an opposition player<br>1 = the punch either lands at the goalkeeper's own team or goes out of play |
| 42 | Good skill | A player shows a good piece of skill on the ball, such as a step over or turn on the ball.<br><br>**Outcome:** always set to 1 |
| 43 | Deleted event | Event has been deleted – the event will remain as it was originally with the same ID but will be resent with the type altered to 43.<br><br>**Outcome:** always set to 1 |
| 44 | Aerial | Two players from opposing teams contest an aerial ball; these events come in pairs, one for each player, with the outcome indicating the success/failure of the aerial duel.<br><br>**Outcome:** 0 = Player lost aerial duel<br>1 = Player won aerial duel |
| 45 | Challenge | A player unsuccessfully attempts to tackle an opponent as the opponent dribbles past them.<br><br>**Outcome:** always set to 0 - a challenge by definition is unsuccessful and the player does not win the ball (winning the ball = would be a tackle, eg typeId 7). |
| 49 | Ball recovery | A player gathers a loose ball and gains control of possession for their team.<br><br>**Outcome:** always set to 1 |
| 50 | Dispossessed | Player is successfully tackled and loses possession of the ball.<br><br>**Outcome:** always set to 1 |
| 51 | Error | Mistake by player losing the ball. Leads to a shot or goals as described with qualifier 169 or 170.<br><br>**Outcome:** always set to 1 |
| 52 | Keeper pick-up | Goalkeeper event; picks up the ball.<br><br>**Outcome:** always set to 1 |
| 53 | Cross not claimed | Goalkeeper only event; goalkeeper attempts to catch a cross and fails to make contact with the ball (does not claim the cross).<br><br>**Outcome:** always set to 1 |
| 54 | Smother | Goalkeeper only event; goalkeeper covers a ground ball in the box and collects it, winning possession.<br><br>**Outcome:** always set to 1 |
| 55 | Offside provoked | Awarded to last defender when an offside decision is given against an attacker.<br><br>**Outcome:** always set to 1 |
| 56 | Shield ball opp | Defender uses his body to shield the ball from an opponent as it rolls out of play.<br><br>**Outcome:** always set to 1 |
| 57 | Foul throw-in | A player takes a throw-in incorrectly, resulting in the throw being awarded to the other team. These events come in pairs; one for the player who commits the foul throw, another for the team that is then awarded the throw-in.<br><br>**Outcome:** 0 = Player who conceded the foul throw<br>1 = Player who won the foul throw |
| 58 | Penalty faced | An event which categorizes goalkeeper movement when facing a penalty taken.<br><br>**Outcome:** always set to 0 |
| 59 | Keeper Sweeper | Goalkeeper only event; goalkeeper comes off their line to clear or claim the ball.<br><br>**Outcome:** set to 0 or 1 |
| 60 | Chance missed | Used when a player does not actually make a shot on goal but was in a good position to score and only just missed receiving a pass.<br><br>**Outcome:** always set to 0 |
| 61 | Ball touch | Used when a player makes a bad touch on the ball and loses possession. Outcome 1 – ball simply hit the player unintentionally. Outcome 0 – Player unsuccessfully controlled the ball. |
| 63 | Temp_Save | An event indicating a save has occurred but without full details. Event typeId 10 will follow shortly afterwards with full details.<br><br>**Outcome:** always set to 1 |
| 64 | Resume | The match has resumed on a new date after being abandoned mid-way through the game/during gameplay on a previous date. |
| 65 | Contentious referee decision | Any major talking point or error made by the referee - decision will be assigned to the relevant team. |
| 67 | 50/50 | 2 players running for a loose ball. Added only in post collection for some competitions.<br><br>**Note:** This Event type will not be collected from 10th of July 2023. |
| 68 | Referee Drop Ball | Occurs after an 'End Delay' event (typeId 28) when a match resumes, having been stopped by the referee with the ball in play. This event comes in pairs, with an event given to both teams on restart. |
| 70 | Injury Time Announcement | Declaration of the amount of injury time added at the end of each period as announced pitch-side by the fourth official.<br><br>**Outcome:** always set to 1 |
| 71 | Coach Setup | The qualifiers on this event identify team coaches and their roles.<br><br>**Outcome:** always set to 1 |
| 74 | Blocked Pass | A player blocks a pass attempt by an opponent; similar to an Interception, but the player is already very close to the ball. |
| 75 | Delayed Start | The match start has been delayed. |
| 76 | Early end | The match has had an early end. |
| 79 | Coverage interruption | Indicates that the game (and our analysis) was interrupted; outcome 0 = start of interruption, outcome 1 = end of interruption), qualifier 344 (video coverage lost). The event will be input by the analysts at the beginning and end of the interruption to explain why fewer events may be input during that time.<br><br>**Outcome:** 0 = start of interruption, 1 = end of interruption |
| 80 | Drop of Ball | A goalkeeper drops the ball close to himself with the intention to play it with his feet. |
| 81 | Obstacle | Ball touches the goal frame, the referee, the corner flag or any other non-player object on the field. (excludes attempts which hit the woodwork). |
| 82 | Control | Every ball touch by a player in possession that is not covered by a different event type. Example: A pass.<br><br>**Note:** Only available in F24+ |
| 83 | Attempted Tackle | A player has attempted to tackle an opponent but has been unsuccessful. |
| 84 | Deleted After Review | This New Event type and type_id in order that the Contentious Referee Decision can be linked to it for all VAR cases. The deleted goal will now be a 'Deleted after review' event; we will now be able to link the CRD to this event, like we do to other non-deleted events. It keeps all the previous qualifier information, just like a regular deleted event does. (Adding 1st March 2021) |
