#!/usr/bin/env node
/**
 * Create placeholder SVG pictograms for AT&T Business
 * Uses AT&T brand cyan color (#009fdb)
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../content/products/images');

// AT&T Brand Color
const CYAN = '#009fdb';

// SVG pictograms - simple, clean icons
const pictograms = {
  // Speed/Performance
  'pictogram_speed_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 44c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-2-30v12l10 6 2-3.4-8-4.8V22h-4z"/></svg>`,

  // Reliable/Dependable
  'pictogram_reliable_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 6L8 18v14c0 13.3 10.2 25.7 24 30 13.8-4.3 24-16.7 24-30V18L32 6zm0 27.9h20c-1.2 9.4-8.8 17.8-20 21.5V34H12V20.8l20-9.6v22.7z"/></svg>`,

  // Security/Shield
  'pictogram_security_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 6L8 18v14c0 13.3 10.2 25.7 24 30 13.8-4.3 24-16.7 24-30V18L32 6zm-4 36l-8-8 2.8-2.8 5.2 5.2 13.2-13.2 2.8 2.8-16 16z"/></svg>`,

  // Guarantee/Badge
  'pictogram_guarantee_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4l-6 12-13 2 9.4 9.2L20 40l12-6.3L44 40l-2.4-12.8L51 18l-13-2-6-12zm0 10.4l3.2 6.4 7 1-5 4.9 1.2 7-6.4-3.4-6.4 3.4 1.2-7-5-4.9 7-1 3.2-6.4z"/></svg>`,

  // Tools/Wrench
  'pictogram_tools_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M52.5 11.5c-4.7-4.7-11.8-5.6-17.5-2.8l12.7 12.7-5.7 5.7-12.7-12.7c-2.8 5.7-1.9 12.8 2.8 17.5 3.7 3.7 9 5.1 13.8 4L56 46c2.2 2.2 5.8 2.2 8 0s2.2-5.8 0-8l-10.1-10.1c1.1-4.8-.3-10.1-4-13.8zM12 56l16-16 4 4-16 16-4-4z"/></svg>`,

  // Device/Phone
  'pictogram_device_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M44 4H20c-2.2 0-4 1.8-4 4v48c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V8c0-2.2-1.8-4-4-4zm-12 54c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm12-10H20V12h24v36z"/></svg>`,

  // Network/Globe
  'pictogram_network_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 52c-2.6 0-6-5.4-7.2-14H39c-1.2 8.6-4.6 14-7 14zm-8-18c-.3-2-.5-4.1-.5-6s.2-4 .5-6h16c.3 2 .5 4.1.5 6s-.2 4-.5 6H24zm-16-6c0-2.1.3-4.1.8-6h10.8c-.3 2-.5 4-.5 6s.2 4 .5 6H8.8c-.5-1.9-.8-3.9-.8-6zm24-24c2.6 0 6 5.4 7.2 14H25c1.2-8.6 4.6-14 7-14zm16.4 18h10.8c.5 1.9.8 3.9.8 6s-.3 4.1-.8 6H44.4c.3-2 .5-4 .5-6s-.2-4-.5-6z"/></svg>`,

  // Contacts/People
  'pictogram_contacts_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 32c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm0 4c-8.8 0-26 4.4-26 13v7h52v-7c0-8.6-17.2-13-26-13z"/></svg>`,

  // Call Forward
  'pictogram_call-forward_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M16.8 27.2c3.8 7.6 10.4 14.2 18 18l6-6c.7-.7 1.8-.9 2.8-.6 3 1 6.2 1.5 9.5 1.5 1.5 0 2.8 1.2 2.8 2.8V52c0 1.5-1.2 2.8-2.8 2.8C25.6 54.8 9.2 38.4 9.2 17.9c0-1.5 1.2-2.8 2.8-2.8h8.9c1.5 0 2.8 1.2 2.8 2.8 0 3.3.5 6.5 1.5 9.5.2.9 0 2-.6 2.8l-6 6zM46 8l-8 8h6v16h4V16h6l-8-8z"/></svg>`,

  // Block/Ban
  'pictogram_block_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 4c5.4 0 10.3 1.8 14.4 4.8L14.8 46.4C11.8 42.3 10 37.4 10 32c0-12.1 9.9-22 22-22zm0 44c-5.4 0-10.3-1.8-14.4-4.8l31.6-31.6c3 4.1 4.8 9 4.8 14.4 0 12.1-9.9 22-22 22z"/></svg>`,

  // Decline/X
  'pictogram_decline_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm14 38l-4 4-10-10-10 10-4-4 10-10-10-10 4-4 10 10 10-10 4 4-10 10 10 10z"/></svg>`,

  // 5G
  'pictogram_5G_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><text x="50%" y="55%" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="24">5G</text></svg>`,
  'pictogram_5g_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><text x="50%" y="55%" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="24">5G</text></svg>`,

  // Power/Lightning
  'pictogram_power_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M36 4L12 36h16l-4 24 24-32H32l4-24z"/></svg>`,

  // Reach/Arrow
  'pictogram_reach_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M56 8H36v4h14.3L28.6 33.7l2.8 2.8L53 14.8V28h4V8zM8 56V24h4v26h26v4H8z"/></svg>`,

  // Routing/Arrows
  'pictogram_routing_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M40 8v8H24c-4.4 0-8 3.6-8 8v8h-8l12 12 12-12h-8v-8h20v8h-8l12 12 12-12h-8V24c0-4.4-3.6-8-8-8h-4V8h-8z"/></svg>`,

  // Video/Camera
  'pictogram_video_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M44 24v-4c0-2.2-1.8-4-4-4H12c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h28c2.2 0 4-1.8 4-4v-4l12 8V16l-12 8z"/></svg>`,

  // Message/Chat
  'pictogram_message_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M52 8H12c-4.4 0-8 3.6-8 8v28c0 4.4 3.6 8 8 8h8v10l14-10h18c4.4 0 8-3.6 8-8V16c0-4.4-3.6-8-8-8zM20 36h-4v-4h4v4zm0-8h-4v-4h4v4zm0-8h-4v-4h4v4zm28 16H28v-4h20v4zm0-8H28v-4h20v4zm0-8H28v-4h20v4z"/></svg>`,

  // Fax
  'pictogram_fax_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M52 20h-4v-8c0-2.2-1.8-4-4-4H20c-2.2 0-4 1.8-4 4v8h-4c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8V28c0-4.4-3.6-8-8-8zM20 12h24v8H20v-8zm24 36H20V36h24v12zm8-12h-4v-4h4v4z"/></svg>`,

  // Mobile/Smartphone
  'pictogram_mobile_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M44 4H20c-2.2 0-4 1.8-4 4v48c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V8c0-2.2-1.8-4-4-4zm-12 54c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm12-10H20V12h24v36z"/></svg>`,

  // Standard/Basic
  'pictogram_standard_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 52c-13.2 0-24-10.8-24-24S18.8 8 32 8s24 10.8 24 24-10.8 24-24 24zm-4-36h8v20h-8V20zm0 24h8v8h-8v-8z"/></svg>`,

  // Premium/Star
  'pictogram_premium_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4l8 16 18 3-13 12.7 3 17.7-16-8.4-16 8.4 3-17.7L6 23l18-3 8-16z"/></svg>`,

  // Ultimate/Diamond
  'pictogram_ultimate_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4L8 24l24 36 24-36L32 4zm0 8l16 12H16l16-12zm-18 16h36L32 52 14 28z"/></svg>`,

  // Scale/Expand
  'pictogram_scale_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M8 8v16h4V14.8l13.2 13.2 2.8-2.8L14.8 12H24V8H8zm32 0v4h9.2L36 25.2l2.8 2.8L52 14.8V24h4V8H40zM27.2 36L14 49.2V40H10v16h16v-4h-9.2L30 38.8 27.2 36zm9.6 0l-2.8 2.8L47.2 52H38v4h16V40h-4v9.2L36.8 36z"/></svg>`,

  // Performance/Gauge
  'pictogram_performance_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 44c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm8-22l-12 12-2.8-2.8 12-12L40 30z"/></svg>`,

  // Visibility/Eye
  'pictogram_visibility_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 16C18 16 6 28 4 32c2 4 14 16 28 16s26-12 28-16c-2-4-14-16-28-16zm0 28c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12zm0-20c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"/></svg>`,

  // Support/Headset
  'pictogram_support_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C18.7 4 8 14.7 8 28v18c0 3.3 2.7 6 6 6h6V32h-6v-4c0-9.9 8.1-18 18-18s18 8.1 18 18v4h-6v20h6c3.3 0 6-2.7 6-6V28c0-13.3-10.7-24-24-24z"/></svg>`,

  // Guidance/Compass
  'pictogram_guidance_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 52c-13.2 0-24-10.8-24-24S18.8 8 32 8s24 10.8 24 24-10.8 24-24 24zm-4-36l20 8-8 20-20-8 8-20zm4 16c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"/></svg>`,

  // Cloud Security
  'pictogram_cloud-security_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M52 28c0-8.8-7.2-16-16-16-7.3 0-13.4 4.9-15.3 11.6C14.8 24.2 10 29.4 10 36c0 6.6 5.4 12 12 12h28c5.5 0 10-4.5 10-10 0-4.5-3-8.3-7.2-9.5-.5-.3-.8-.3-.8-.5zM32 44l-8-8 2.8-2.8 5.2 5.2 9.2-9.2 2.8 2.8-12 12z"/></svg>`,

  // Managed/Gear
  'pictogram_managed_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M55.4 28l-4-6.9 2.9-6.4-6.4-3.7-6.4 2.9-6.9-4h-5.2l-6.9 4-6.4-2.9-6.4 3.7 2.9 6.4-4 6.9v5.2l4 6.9-2.9 6.4 6.4 3.7 6.4-2.9 6.9 4h5.2l6.9-4 6.4 2.9 6.4-3.7-2.9-6.4 4-6.9V28zm-23.4 16c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z"/></svg>`,

  // Savings/Dollar
  'pictogram_savings_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm4 40v4h-8v-4c-4.4 0-8-3.6-8-8h6c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4s-1.8-4-4-4h-4c-5.5 0-10-4.5-10-10s4.5-10 10-10v-4h8v4c4.4 0 8 3.6 8 8h-6c0-2.2-1.8-4-4-4h-4c-2.2 0-4 1.8-4 4s1.8 4 4 4h4c5.5 0 10 4.5 10 10s-4.5 10-10 10z"/></svg>`,

  // Integration/Puzzle
  'pictogram_integration_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M52 28v-8h-8v-4c0-2.2-1.8-4-4-4h-4V8h-8v4h-4c-2.2 0-4 1.8-4 4v4h-8v8h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4v8h8v4c0 2.2 1.8 4 4 4h4v4h8v-4h4c2.2 0 4-1.8 4-4v-4h8v-8h-4c-2.2 0-4-1.8-4-4s1.8-4 4-4h4z"/></svg>`,

  // Quality/Check
  'pictogram_quality_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm-4 40L16 32l4-4 8 8 16-16 4 4-20 20z"/></svg>`,

  // No Cost/Free
  'pictogram_no-cost_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 52c-13.2 0-24-10.8-24-24S18.8 8 32 8s24 10.8 24 24-10.8 24-24 24zm4-32h-8v4h8c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4v-4l-6 6 6 6v-4h4c5.5 0 10-4.5 10-10s-4.5-10-10-10z"/></svg>`,

  // Teams/Group
  'pictogram_teams_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M24 32c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm-14 16c0-4.7 9.3-7 14-7s14 2.3 14 7v4H10v-4zm30-16c4.4 0 8-3.6 8-8s-3.6-8-8-8c-1.5 0-2.9.4-4.1 1.2 1.3 2 2.1 4.4 2.1 6.8s-.8 4.8-2.1 6.8c1.2.8 2.6 1.2 4.1 1.2zm6 9.2c2.4 1.6 4 3.8 4 6.8v4h-8v-4c0-2.6-1-4.9-2.7-6.8.6 0 1.1 0 1.7 0 1.8 0 3.5.3 5 1z"/></svg>`,

  // VoIP/Waves
  'pictogram_voip_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M12 32c0-11 9-20 20-20v4c-8.8 0-16 7.2-16 16s7.2 16 16 16v4c-11 0-20-9-20-20zm8 0c0-6.6 5.4-12 12-12v4c-4.4 0-8 3.6-8 8s3.6 8 8 8v4c-6.6 0-12-5.4-12-12zm12-4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/></svg>`,

  // Benefits/Gift
  'pictogram_benefits_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M52 20h-8c2.2 0 4-1.8 4-4s-1.8-4-4-4c-2.8 0-5 1.4-8 4-3-2.6-5.2-4-8-4-2.2 0-4 1.8-4 4s1.8 4 4 4h-8c-2.2 0-4 1.8-4 4v4c0 2.2 1.8 4 4 4v20c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V32c2.2 0 4-1.8 4-4v-4c0-2.2-1.8-4-4-4zM36 24h12v4H36v-4zm-12 0h8v4h-8v-4zm0 28V32h8v20h-8zm20 0h-8V32h8v20z"/></svg>`,

  // Easy Setup/Magic Wand
  'pictogram_easy-setup_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M52.4 11.6l-5.7 5.7-2.8-2.8 5.7-5.7c-3.1-3.1-8.2-3.1-11.3 0L9.2 37.9c-3.1 3.1-3.1 8.2 0 11.3l5.7 5.7c3.1 3.1 8.2 3.1 11.3 0l28.1-28.1c3.1-3.1 3.1-8.2 0-11.3l-1.9-1.9zM24.8 50.7l-2.8-2.8L42.2 28l2.8 2.8L24.8 50.7z"/></svg>`,

  // No Contract
  'pictogram_no-contract_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M44 8H20c-2.2 0-4 1.8-4 4v40c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4zm-20 8h16v4H24v-4zm16 32H24v-4h16v4zm0-8H24v-4h16v4zm0-8H24v-4h16v4z"/></svg>`,

  // Fast/Rocket
  'pictogram_fast_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M48 8c-8 0-16 8-20 16H16l-8 12h12c-2 4-2 8-2 8l8-4c0 0 4 0 8-2v12l12-8H34c8-4 16-12 16-20 0-4-2-14-2-14zm-8 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>`,

  // Plus
  'pictogram_plus_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm12 30H34v10h-4V34H20v-4h10V20h4v10h10v4z"/></svg>`,

  // Starter/Play
  'pictogram_starter_pos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${CYAN}"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm-8 40V20l24 12-24 12z"/></svg>`,
};

// Additional missing images - placeholder photos
const placeholderPhotos = {
  'dedicated-internet-hero-mobile.jpg': 'Network Infrastructure',
  'dedicated-internet-story.jpg': 'Business Technology',
  'jd-power-award.png': 'JD Power Award',
  'aviation-story.jpg': 'Aviation',
  'collaboration-story.jpg': 'Business Collaboration',
  'cybersecurity-story.jpg': 'Cybersecurity',
  'tech-explained.png': 'Tech Explained',
  'business-internet.png': 'Business Internet',
  'dynamic-defense.png': 'Dynamic Defense',
  'dedicated-vs-shared.png': 'Dedicated vs Shared',
  'sdwan-infographic.png': 'SD-WAN Infographic',
  'sdwan-schools.jpg': 'Schools Network',
  'sdwan-retail.jpg': 'Retail Technology',
  'cisco-partner.png': 'Cisco Partner',
  'vmware-partner.png': 'VMware Partner',
  'aruba-partner.png': 'Aruba Partner',
  'mef-award.png': 'MEF Award',
  'gartner-award.png': 'Gartner Award',
  'idc-award.png': 'IDC Award',
  'enterprise-award.png': 'Enterprise Award',
  'internet-air-hero-mobile.jpg': 'Wireless Internet',
  'internet-air-device.png': 'Internet Air Device',
  'dedicated-internet-device.png': 'Dedicated Internet Device',
  'reward-card.png': 'Reward Card',
  'internet-air-story.jpg': 'Internet Air',
  'support-image.jpg': 'Support',
  'chat-image.jpg': 'Chat Support',
};

// Create a placeholder image SVG
function createPlaceholderImage(text) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="#f3f4f6">
  <rect width="400" height="300" fill="#f3f4f6"/>
  <rect x="10" y="10" width="380" height="280" fill="white" stroke="#e5e7eb" stroke-width="2"/>
  <text x="200" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#9ca3af">${text}</text>
  <path d="M170 180l20-30 20 20 30-40 30 50z" fill="#e5e7eb"/>
  <circle cx="160" cy="120" r="15" fill="#e5e7eb"/>
</svg>`;
}

// Write all pictograms
console.log('Creating pictogram SVGs...');
let created = 0;

for (const [filename, svg] of Object.entries(pictograms)) {
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, svg);
    console.log(`[OK] ${filename}`);
    created++;
  } else {
    console.log(`[SKIP] ${filename} (exists)`);
  }
}

// Write placeholder photos
console.log('\nCreating placeholder images...');
for (const [filename, text] of Object.entries(placeholderPhotos)) {
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    // For .jpg files, we'll still create SVG but name it with original extension
    // Note: This is a workaround - in production you'd want real images
    const svgContent = createPlaceholderImage(text);
    // Create as SVG for now since we can't create real JPG/PNG without image libraries
    const svgPath = filePath.replace(/\.(jpg|png)$/, '.svg');
    fs.writeFileSync(svgPath, svgContent);
    console.log(`[OK] ${filename} -> ${path.basename(svgPath)}`);
    created++;
  } else {
    console.log(`[SKIP] ${filename} (exists)`);
  }
}

console.log(`\nCreated ${created} placeholder icons/images`);
