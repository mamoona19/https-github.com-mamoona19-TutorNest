import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentSidebar } from './parent-sidebar';

describe('ParentSidebar', () => {
  let component: ParentSidebar;
  let fixture: ComponentFixture<ParentSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
