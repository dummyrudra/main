import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VoterComponent } from './voter.component';

describe('VoterComponent', () => {
  let component: VoterComponent;
  let voter: VoterComponent;
  let fixture: ComponentFixture<VoterComponent>;
  beforeEach(() => {
    component = new VoterComponent();
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(VoterComponent);
    voter = fixture.componentInstance;
  });

  it('should increment the totalVotes when upvoted.', () => {
    component.upVote();

    expect(component.totalVotes).toBe(1);
  });

  it('should raise voteChanged event when upvoted.', () => {
    let totalVotes: any = null;
    component.voteChanged.subscribe((tv) => (totalVotes = tv));

    component.upVote();

    expect(totalVotes).not.toBeNull();

    expect(totalVotes).toBe(1);
  });

  // Itegration.................

  it('should render totalVotes', () => {
    voter.totalVotes = 20;
    voter.myVote = 1;

    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.vote-count'));
    let el: HTMLElement = de.nativeElement;
    expect(el.innerText).toContain('20');
  });

  it('should highlight the upVote', () => {
    voter.myVote = 1;

    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.upVote'));

    expect(de.classes['bi-hand-thumbs-up-fill']).toBeTruthy();
  });

  it('should increase totalVotes when clicked on upVote', () => {
    let upVote = fixture.debugElement.query(By.css('.upVote'));
    upVote.triggerEventHandler('click', null);

    expect(voter.totalVotes).toBe(1);
  });

  it('should highlight the downVote', () => {
    voter.myVote = -1;

    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.downVote'));

    expect(de.classes['bi-hand-thumbs-down-fill']).toBeTruthy();
  });

  it('should decrease totalVotes when clicked on downVote', () => {
    let downVote = fixture.debugElement.query(By.css('.downVote'));
    downVote.triggerEventHandler('click', null);

    expect(voter.totalVotes).toBe(-1);
  });

  it('should return from downVote method when downVote is already clicked.', () => {
    let downVote = fixture.debugElement.query(By.css('.downVote'));
    downVote.triggerEventHandler('click', null);
    downVote.triggerEventHandler('click', null);

    expect(voter.totalVotes).toBe(-1);
  });

  it('should return from upVote method when upVote is already clicked.', () => {
    let upVote = fixture.debugElement.query(By.css('.upVote'));
    upVote.triggerEventHandler('click', null);
    upVote.triggerEventHandler('click', null);

    expect(voter.totalVotes).toBe(1);
  });
});
